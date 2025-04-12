import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { CourseInfoEntity } from '../../entity/info';
import { CourseInfoService } from '../../service/info';

/**
 * 课程信息
 */
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['page', 'info'],
})
@CoolController({
  api: ['page', 'info'],
  entity: CourseInfoEntity,
  service: CourseInfoService,
  pageQueryOp: {
    keyWordLikeFields: ['a.title'],
    fieldEq: ['a.typeId'],
    select: ['a.*'],
    where: ctx => {
      const { isFree, recommendId } = ctx.request.body;

      return [
        ['a.status = 1', {}],
        isFree ? ['a.price = 0', {}] : ['a.price > 0', {}],
        [
          'a.id != :recommendId',
          {
            recommendId,
          },
          !!recommendId,
        ],
      ];
    },
  },
})
export class AppCourseInfoController extends BaseController {}
