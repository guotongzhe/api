import { CoolController, BaseController } from '@cool-midway/core';
import { UserViewEntity } from '../../entity/view';
import { UserViewService } from '../../service/view';
import { Body, Inject, Post } from '@midwayjs/core';
import { CourseInfoEntity } from '../../../course/entity/info';

/**
 * 浏览记录
 */
@CoolController({
  api: ['page'],
  entity: UserViewEntity,
  service: UserViewService,
  pageQueryOp: {
    select: ['b.*', 'a.data'],
    join: [
      {
        entity: CourseInfoEntity,
        alias: 'b',
        condition: 'a.courseId = b.id',
      },
    ],
    where: ctx => {
      return [['a.userId =:userId', { userId: ctx.user.id }]];
    },
    addOrderBy: {
      updateTime: 'DESC',
    },
  },
})
export class AppUserViewController extends BaseController {
  @Inject()
  userViewService: UserViewService;

  @Inject()
  ctx;

  @Post('/record')
  async record(@Body('courseId') courseId: number, @Body('data') data: any) {
    return this.ok(
      await this.userViewService.record(courseId, data, this.ctx.user.id)
    );
  }
}
