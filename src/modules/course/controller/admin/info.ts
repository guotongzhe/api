import { CoolController, BaseController } from '@cool-midway/core';
import { CourseInfoEntity } from '../../entity/info';

/**
 * 课程信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CourseInfoEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.title'],
    fieldEq: ['a.typeId'],
  },
})
export class AdminCourseInfoController extends BaseController {}
