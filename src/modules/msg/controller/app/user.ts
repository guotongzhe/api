import { CoolController, BaseController } from '@cool-midway/core';
import { MsgUserEntity } from '../../entity/user';
import { MsgInfoEntity } from '../../entity/info';

/**
 * 用户消息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: MsgUserEntity,
  pageQueryOp: {
    select: ['a.*', 'b.title', 'b.content', 'b.data'],
    where: ctx => {
      return [['a.userId=:userId', { userId: ctx.user?.id }]];
    },
    join: [
      {
        entity: MsgInfoEntity,
        alias: 'b',
        condition: 'a.infoId = b.id',
      },
    ],
  },
})
export class AppMsgUserController extends BaseController {}
