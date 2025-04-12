import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { CountUserService } from '../../service/user';
import { CountOrderService } from '../../service/order';
import { CountCourseService } from '../../service/course';

/**
 * 首页统计
 */
@CoolController()
export class AdminCountHomeController extends BaseController {
  @Inject()
  countUserService: CountUserService;

  @Inject()
  countOrderService: CountOrderService;

  @Inject()
  countCourseService: CountCourseService;

  @Post('/userSummary', { summary: '用户概况' })
  async userSummary() {
    return this.ok(await this.countUserService.summary());
  }

  @Post('/userChart', { summary: '用户图表' })
  async userChart(
    // 天数
    @Body('dayCount') dayCount: number
  ) {
    return this.ok(await this.countUserService.chart(dayCount));
  }

  @Post('/orderSummary', { summary: '订单概况' })
  async orderSummary(
    // 类型 count-数量 amount-金额
    @Body('type') type: 'count' | 'amount'
  ) {
    return this.ok(await this.countOrderService.summary(type));
  }

  @Post('/orderChart', { summary: '订单图表' })
  async orderChart(
    // 天数
    @Body('dayCount') dayCount: number,
    // 类型 count-数量 amount-金额
    @Body('type') type: 'count' | 'amount'
  ) {
    return this.ok(await this.countOrderService.chart(dayCount, type));
  }

  @Post('/courseSummary', { summary: '课程概况' })
  async courseSummary() {
    return this.ok(await this.countCourseService.summary());
  }
}
