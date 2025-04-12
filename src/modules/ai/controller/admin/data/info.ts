import { CoolController, BaseController } from '@cool-midway/core';
import { AiDataInfoEntity } from '../../../entity/data/info';
import { AiDataService } from '../../../service/data/info';
import { Body, Inject, Post } from '@midwayjs/core';

/**
 * AI 数据
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: AiDataInfoEntity,
  service: AiDataService,
  pageQueryOp: {
    keyWordLikeFields: ['a.title'],
    fieldEq: ['a.typeId'],
  },
})
export class AdminAiDataInfoController extends BaseController {
  @Inject()
  aiDataService: AiDataService;

  @Post('/search', { summary: '检索' })
  async search(
    @Body('typeId') typeId: number,
    @Body('text') text: string,
    // 返回条数
    @Body('nResults') nResults = 10
  ) {
    return this.ok(await this.aiDataService.search(typeId, text, nResults));
  }
}
