import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { AiSessionService } from '../../service/session';

/**
 * AI通用
 */
@CoolController()
export class AppAiCommController extends BaseController {
  @Inject()
  aiSessionService: AiSessionService;

  @Inject()
  ctx;

  @Post('/invoke', { summary: '调用' })
  async invoke(@Body('content') content: string, @Body('appId') appId) {
    const objectId = this.ctx.user.id;
    return this.ok(
      await this.aiSessionService.comm({
        content,
        appId,
        objectId,
        isAdmin: false,
      })
    );
  }
}
