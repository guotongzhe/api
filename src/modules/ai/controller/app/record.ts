import { CoolController, BaseController } from '@cool-midway/core';
import { AiRecordEntity } from '../../entity/record';
import { Inject, Post, Body } from '@midwayjs/core';
import { AiRecordService } from '../../service/record';
import { AiAppEntity } from '../../entity/app';

/**
 * AI记录
 */
@CoolController({
  api: ['page'],
  entity: AiRecordEntity,
  service: AiRecordService,
  pageQueryOp: {
    fieldEq: ['a.appId'],
    select: ['a.*', 'b.name as appName', 'b.logo as appLogo'],
    join: [
      {
        entity: AiAppEntity,
        alias: 'b',
        condition: 'a.appId = b.id',
      },
    ],
    where: ctx => {
      const userId = ctx.user.id;
      return [['a.objectId =:objectId', { objectId: userId }]];
    },
  },
})
export class AppAiRecordController extends BaseController {
  @Inject()
  aiRecordService: AiRecordService;

  @Inject()
  ctx;

  @Post('/clear', { summary: '清空' })
  async clear(@Body('appId') appId: number) {
    const objectId = this.ctx.user.id;
    return this.ok(await this.aiRecordService.clear(objectId, appId, [0]));
  }
}
