import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { CourseItemEntity } from '../../entity/item';
import { CourseItemService } from '../../service/item';

/**
 * 课程-节
 */
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['list'],
})
@CoolController({
  api: ['list'],
  entity: CourseItemEntity,
  service: CourseItemService,
  listQueryOp: {
    fieldEq: ['a.courseId'],
  },
})
export class AppCourseItemController extends BaseController {}
