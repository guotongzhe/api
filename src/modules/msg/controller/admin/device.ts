import { CoolController, BaseController } from '@cool-midway/core';
import { UserInfoEntity } from '../../../user/entity/info';
import { MsgDeviceEntity } from '../../entity/device';

/**
 * 用户设备
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: MsgDeviceEntity,
  pageQueryOp: {
    keyWordLikeFields: ['b.nickName', 'a.cid', 'a.alias'],
    fieldEq: ['a.status', 'a.infoId', 'a.type'],
    select: ['a.*', 'b.nickName', 'b.avatarUrl'],
    join: [
      {
        entity: UserInfoEntity,
        alias: 'b',
        condition: 'a.userId = b.id',
      },
    ],
  },
})
export class AdminMsgDeviceController extends BaseController {}
