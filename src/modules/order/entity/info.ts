import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';
import { UserAddressEntity } from '../../user/entity/address';
import { CourseInfoEntity } from '../../course/entity/info';

/**
 * 订单信息
 */
@Entity('order_info')
export class OrderInfoEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '标题', nullable: true })
  title: string;

  @Column({ comment: '支付方式 0-待支付 1-微信 2-支付宝', default: 0 })
  payType: number;

  @Column({ comment: '支付时间', type: 'datetime', nullable: true })
  payTime: Date;

  @Index()
  @Column({ comment: '订单号', nullable: true })
  orderNum: string;

  @Column({
    comment: '状态 0-待付款 1-已支付 2-退款中 3-已退款 4-已关闭',
    type: 'tinyint',
    default: 0,
  })
  status: number;

  @Column({
    comment: '价格',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  price: number;

  @Column({
    comment: '优惠金额',
    type: 'decimal',
    scale: 2,
    precision: 12,
    default: 0,
  })
  discountPrice: number;

  @Column({ comment: '优惠来源', type: 'json', nullable: true })
  discountSource: {
    // 0-优惠券
    type: number;
    // 对象ID
    objectId: number;
    // 信息
    info: any;
  };

  @Column({ comment: '地址', type: 'json', nullable: true })
  address: UserAddressEntity;

  @Column({ comment: '物流信息', type: 'json', nullable: true })
  logistics: {
    // 物流公司
    company: string;
    // 物流单号
    num: string;
  };

  @Column({ comment: '退款', type: 'json', nullable: true })
  refund: {
    // 退款单号
    orderNum: string;
    // 金额
    amount: number;
    // 实际退款金额
    realAmount: number;
    // 状态 0-申请中 1-已退款 2-拒绝
    status: number;
    // 申请时间
    applyTime: Date;
    // 退款时间
    time: Date;
    // 退款原因
    reason: string;
    // 拒绝原因
    refuseReason: string;
  };

  @Index()
  @Column({
    asExpression: "JSON_EXTRACT(refund, '$.status')",
    generatedType: 'VIRTUAL',
    comment: '退款状态',
    nullable: true,
  })
  refundStatus: number;

  @Index()
  @Column({
    asExpression: "JSON_EXTRACT(refund, '$.applyTime')",
    generatedType: 'VIRTUAL',
    comment: '退款申请时间',
    nullable: true,
  })
  refundApplyTime: Date;

  @Column({ comment: '备注', nullable: true })
  remark: string;

  @Column({ comment: '关闭备注', nullable: true })
  closeRemark: string;

  @Column({ comment: '微信类型 0-小程序 1-公众号 2-App', default: 0 })
  wxType: number;

  @Column({ comment: '订单商品', type: 'json' })
  goods: CourseInfoEntity;

  @Column({ comment: '课程ID' })
  courseId: number;
}
