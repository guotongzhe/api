import { CoolController, BaseController } from '@cool-midway/core';
import { CourseItemEntity } from '../../entity/item';
import { CourseItemService } from '../../service/item';

/**
 * 课程-节
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CourseItemEntity,
  service: CourseItemService,
  pageQueryOp: {
    keyWordLikeFields: ['a.title'],
    fieldEq: ['a.courseId'],
  },
})
export class AdminCourseItemController extends BaseController {}
