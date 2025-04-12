import {
  CoolController,
  BaseController,
  TagTypes,
  CoolUrlTag,
} from '@cool-midway/core';
import { CourseTypeEntity } from '../../entity/type';

/**
 * 分类
 */
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['list'],
})
@CoolController({
  api: ['list'],
  entity: CourseTypeEntity,
  listQueryOp: {
    keyWordLikeFields: ['a.name'],
    addOrderBy: {
      sortNum: 'asc',
    },
    where: () => {
      return [['a.status =:status', { status: 1 }]];
    },
  },
})
export class AppCourseTypeController extends BaseController {}
