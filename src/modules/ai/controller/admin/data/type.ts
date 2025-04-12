import { CoolController, BaseController } from '@cool-midway/core';
import { AiDataTypeEntity } from '../../../entity/data/type';
import { AiDataTypeService } from '../../../service/data/type';
import { Body, Inject, Post } from '@midwayjs/core';

/**
 * AI 数据类型
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: AiDataTypeEntity,
  service: AiDataTypeService,
  pageQueryOp: {
    keyWordLikeFields: ['a.name'],
    fieldEq: ['a.type'],
  },
})
export class AdminAiDataTypeController extends BaseController {
  @Inject()
  aiDataTypeService: AiDataTypeService;

  @Post('/rebuild', { summary: '重建' })
  async rebuild(@Body('typeId') typeId: number) {
    this.aiDataTypeService.rebuild(typeId);
    return this.ok();
  }
}
