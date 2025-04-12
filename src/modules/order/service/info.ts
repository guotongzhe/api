import { Init, Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { OrderInfoEntity } from '../entity/info';
import * as moment from 'moment';
import { UserAddressService } from '../../user/service/address';
import { Action, OrderQueue } from '../queue/order';
import { OrderPayService } from './pay';
import { PluginService } from '../../plugin/service/info';
import { BaseSysParamService } from '../../base/service/sys/param';
import BigNumber from 'bignumber.js';
import { AppGoodsEntity } from '../../app/entity/goods';
import { CourseInfoService } from '../../course/service/info';
import { CourseInfoEntity } from '../../course/entity/info';

/**
 * 订单信息
 */
@Provide()
export class OrderInfoService extends BaseService {
  @InjectEntityModel(OrderInfoEntity)
  orderInfoEntity: Repository<OrderInfoEntity>;

  @InjectEntityModel(AppGoodsEntity)
  appGoodsEntity: Repository<AppGoodsEntity>;

  @Inject()
  userAddressService: UserAddressService;

  @Inject()
  orderPayService: OrderPayService;

  @Inject()
  orderQueue: OrderQueue;

  @Inject()
  pluginService: PluginService;

  @Inject()
  baseSysParamService: BaseSysParamService;

  @Inject()
  courseInfoService: CourseInfoService;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.orderInfoEntity);
  }

  /**
   * 修改前
   * @param data
   * @param type
   */
  async modifyBefore(data: any, type: 'add' | 'update' | 'delete') {
    if (type == 'add' || type == 'update') {
      delete data.refundStatus;
      delete data.refundApplyTime;
    }
  }

  /**
   * 根据订单号获取订单
   * @param orderNum
   * @returns
   */
  async getByOrderNum(orderNum: string) {
    return this.orderInfoEntity.findOneBy({
      orderNum: Equal(orderNum),
    });
  }

  /**
   * 修改订单状态
   * @param id
   * @param status
   */
  async changeStatus(id: number, status: number) {
    await this.orderInfoEntity.update({ id }, { status });
  }

  /**
   * 关闭订单
   * @param orderId
   * @param remark
   */
  async close(orderId: number, remark: string) {
    const order = await this.info(orderId);
    if (!order || !remark)
      throw new CoolCommException('订单不存在或备注不能为空');
    if (order.status != 0) {
      throw new CoolCommException('订单状态不允许关闭');
    }

    await this.orderInfoEntity.update(
      { id: orderId },
      { status: 4, closeRemark: remark }
    );
  }

  /**
   * 订单详情
   * @param id
   * @param infoIgnoreProperty
   */
  async info(id: any, infoIgnoreProperty?: string[]) {
    const info = await super.info(id, infoIgnoreProperty);
    if (!info) {
      throw new CoolCommException('订单不存在');
    }
    return info;
  }

  /**
   * 创建订单
   * @param data
   */
  async create(data: { userId: number; goodsId: number; remark: string }) {
    const order = {
      userId: data.userId,
      remark: data.remark,
    } as OrderInfoEntity;

    const goods: CourseInfoEntity = await this.courseInfoService.info(
      data.goodsId
    );
    if (!goods || goods.status != 1) {
      throw new CoolCommException('课程不存在或已下架');
    }

    order.price = goods.price;
    order.title = goods.title;
    order.goods = goods;
    order.courseId = goods.id;

    await this.orderInfoEntity.insert(order);

    // 生成订单号
    const orderNum = await this.generateOrderNum(order.id);

    // 更新订单
    await this.orderInfoEntity.update(order.id, {
      orderNum,
    });

    const orderTimeout = await this.baseSysParamService.dataByKey(
      'orderTimeout'
    );
    // 发送订单创建消息
    this.orderQueue.add(
      { orderId: order.id, action: Action.TIMEOUT },
      {
        // 超时关闭订单
        delay: orderTimeout * 60 * 1000,
      }
    );
    return order;
  }

  /**
   * 生成订单号
   * @param orderId
   */
  async generateOrderNum(orderId: number, label = 'U') {
    const orderNum =
      moment().format('YYYYMMDDHHmmss') +
      Math.floor(Math.random() * 10000).toString() +
      orderId.toString();
    return label + orderNum;
  }

  /**
   * 退款
   * @param userId
   * @param orderId
   * @param goodsId
   * @param reason
   */
  async refund(userId: number, orderId: number, reason: string) {
    const order = await this.info(orderId);
    if (order && order.userId != userId) {
      throw new CoolCommException('非法操作');
    }
    if (![1, 2].includes(order.status)) {
      throw new CoolCommException('订单状态不允许退款');
    }

    await this.orderInfoEntity.update(
      { id: Equal(orderId) },
      {
        status: 5,
        refund: {
          amount: new BigNumber(order.price)
            .minus(order.discountPrice)
            .toNumber(),
          status: 0,
          applyTime: new Date(),
          reason,
          orderNum: 'R' + order.orderNum.slice(1),
        },
      }
    );
  }

  /**
   * 退款处理
   * @param orderId
   * @param action 0-拒绝 1-同意
   * @param refuseReason 0-拒绝 1-同意
   * @param amount
   */
  async refundHandle(
    orderId: number,
    action: number,
    refuseReason: string,
    amount: number
  ) {
    const order = await this.info(orderId);
    if (order.status != 1) {
      throw new CoolCommException('订单状态不允许退款处理');
    }
    // 拒绝退款
    if (action == 0) {
      await this.orderInfoEntity.update(
        { id: Equal(orderId) },
        {
          status: 1,
          refund: {
            ...order.refund,
            status: 2,
            refuseReason: refuseReason,
          },
        }
      );
    }
    // 同意退款
    if (action == 1) {
      if (amount > order.price) {
        throw new CoolCommException('退款金额不能大于订单金额');
      }
      // 执行退款操作
      const result = await this.orderPayService.wxRefund(order, amount);

      if (result) {
        await this.orderInfoEntity.update(
          { id: Equal(orderId) },
          {
            status: 3,
            refund: {
              ...order.refund,
              status: 1,
              realAmount: amount,
              time: new Date(),
            },
          }
        );
      }
    }
  }

  /**
   * 用户订单数量
   * @param userId
   */
  async userCount(userId: number) {
    const statusLabels = ['待付款', '已支付', '退款中', '已退款', '已关闭'];
    // 生成查询字符串
    const selectQueries = statusLabels.map(
      (label, index) =>
        `SUM(CASE WHEN status = ${index} THEN 1 ELSE 0 END) AS '${label}'`
    );
    const list = await this.orderInfoEntity
      .createQueryBuilder('a')
      .select(selectQueries)
      .where('a.userId = :userId', { userId })
      .getRawMany();
    return list[0];
  }
}
