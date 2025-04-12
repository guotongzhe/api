import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { CourseEvaluateEntity } from '../../entity/evaluate';
import { UserInfoEntity } from '../../../user/entity/info';
import { Body, Inject, Post } from '@midwayjs/core';
import { CourseEvaluateService } from '../../service/evaluate';

/**
 * 课程评价
 */
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['page'],
})
@CoolController({
  api: ['page', 'add'],
  entity: CourseEvaluateEntity,
  service: CourseEvaluateService,
  pageQueryOp: {
    fieldEq: ['a.courseId'],
    select: ['a.*', 'b.nickName', 'b.avatarUrl'],
    join: [
      {
        alias: 'b',
        entity: UserInfoEntity,
        condition: 'a.userId = b.id',
      },
    ],
  },
})
export class AppCourseEvaluateController extends BaseController {
  @Inject()
  courseEvaluateService: CourseEvaluateService;

  @Inject()
  ctx;

  @Post('/submit')
  async submit(@Body() data: any) {
    return this.ok(
      await this.courseEvaluateService.submit(data, this.ctx.user.id)
    );
  }
}
