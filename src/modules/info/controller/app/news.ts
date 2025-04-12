import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { InfoNewsEntity } from '../../entity/news';
import { InfoNewsService } from '../../service/news';

/**
 * 资讯-新闻
 */
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['page', 'info'],
})
@CoolController({
  api: ['page', 'info'],
  entity: InfoNewsEntity,
  service: InfoNewsService,
  pageQueryOp: {
    keyWordLikeFields: ['a.title'],
    where: () => {
      return [['a.status = 1']];
    },
  },
})
export class AppInfoNewsController extends BaseController {}
