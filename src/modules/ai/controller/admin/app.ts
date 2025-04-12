import { CoolController, BaseController } from '@cool-midway/core';
import { AiAppEntity } from '../../entity/app';
import { AiDataTypeEntity } from '../../entity/data/type';

/**
 * Ai应用
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: AiAppEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.name', 'b.name'],
    fieldEq: ['a.status', 'a.isContext'],
    select: ['a.*', 'b.name as dataName'],
    join: [
      {
        entity: AiDataTypeEntity,
        alias: 'b',
        condition: 'a.dataId = b.id',
      },
    ],
  },
})
export class AdminiAiAppController extends BaseController {}
