import { CoolController, BaseController } from '@cool-midway/core';
import { MsgUserEntity } from '../../entity/user';
import { UserInfoEntity } from '../../../user/entity/info';

/**
 * 用户消息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: MsgUserEntity,
  pageQueryOp: {
    keyWordLikeFields: ['b.nickName'],
    fieldEq: ['a.status', 'a.infoId'],
    select: ['a.*', 'b.nickName'],
    join: [
      {
        entity: UserInfoEntity,
        alias: 'b',
        condition: 'a.userId = b.id',
      },
    ],
  },
})
export class AdminMsgUserController extends BaseController {}
