import { CoolController, BaseController } from '@cool-midway/core';
import { CourseEvaluateEntity } from '../../entity/evaluate';
import { UserInfoEntity } from '../../../user/entity/info';
import { CourseEvaluateService } from '../../service/evaluate';
import { CourseInfoEntity } from '../../entity/info';

/**
 * 课程评价
 */
@CoolController({
  api: ['page', 'delete', 'info', 'update'],
  entity: CourseEvaluateEntity,
  service: CourseEvaluateService,
  pageQueryOp: {
    keyWordLikeFields: ['a.content', 'b.nickName', 'c.title'],
    fieldEq: ['a.courseId'],
    select: ['a.*', 'b.nickName', 'b.avatarUrl', 'c.title'],
    join: [
      {
        alias: 'b',
        entity: UserInfoEntity,
        condition: 'a.userId = b.id',
      },
      {
        alias: 'c',
        entity: CourseInfoEntity,
        condition: 'a.courseId = c.id',
      },
    ],
  },
})
export class AdminCourseEvaluateController extends BaseController {}
