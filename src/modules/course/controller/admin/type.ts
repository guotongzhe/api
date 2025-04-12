import { CoolController, BaseController } from '@cool-midway/core';
import { CourseTypeEntity } from '../../entity/type';

/**
 * 分类
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CourseTypeEntity,
  listQueryOp: {
    keyWordLikeFields: ['name'],
  },
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['parentId'],
  },
})
export class AdminCourseTypeController extends BaseController {}
