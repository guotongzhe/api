import { CoolController, BaseController } from '@cool-midway/core';
import { InfoNewsEntity } from '../../entity/news';

/**
 * 资讯-新闻
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: InfoNewsEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.title'],
    fieldEq: ['a.status'],
  },
})
export class AdminInfoNewsController extends BaseController {}
