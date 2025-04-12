import { CoolController, BaseController } from '@cool-midway/core';
import { OrderInfoEntity } from '../../entity/info';
import { Body, Inject, Post } from '@midwayjs/core';
import { OrderInfoService } from '../../service/info';
import { CourseInfoEntity } from '../../../course/entity/info';

/**
 * 订单信息
 */
@CoolController({
  api: ['page'],
  entity: OrderInfoEntity,
  pageQueryOp: {
    select: ['b.*', 'a.orderNum', 'a.createTime as payTime'],
    join: [
      {
        alias: 'b',
        entity: CourseInfoEntity,
        condition: 'a.courseId = b.id',
      },
    ],
    where: ctx => {
      return [['a.userId = :userId', { userId: ctx.user?.id }]];
    },
  },
})
export class AppOrderInfoController extends BaseController {
  @Inject()
  orderInfoService: OrderInfoService;

  @Inject()
  ctx;

  @Post('/create', { summary: '创建订单' })
  async create(
    @Body('goodsId') goodsId: number,
    @Body('remark') remark: string
  ) {
    const result = await this.orderInfoService.create({
      userId: this.ctx.user.id,
      goodsId,
      remark,
    });

    return this.ok(result);
  }
}
