import { CoolController, BaseController } from '@cool-midway/core';
import { MsgInfoEntity } from '../../entity/info';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { MsgInfoService } from '../../service/info';

/**
 * 消息通知
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: MsgInfoEntity,
  service: MsgInfoService,
  pageQueryOp: {
    keyWordLikeFields: ['a.title'],
    select: ['a.*'],
    where: ctx => {
      return [['a.userId=:userId', { userId: ctx.user?.id }]];
    },
  },
})
export class AppMsgInfoController extends BaseController {
  @Inject()
  msgInfoService: MsgInfoService;

  @Inject()
  ctx;

  @Get('/unreadCount', { summary: '未读消息数量' })
  async unreadCount() {
    return this.ok(await this.msgInfoService.unreadCount(this.ctx.user?.id));
  }

  @Post('/read', { summary: '标记为已读' })
  async read(@Body('infoIds') infoIds: number[]) {
    await this.msgInfoService.read(this.ctx.user?.id, infoIds);
    return this.ok();
  }

  @Post('/clear', { summary: '全部已读' })
  async clear() {
    await this.msgInfoService.clear(this.ctx.user?.id);
    return this.ok();
  }
}
