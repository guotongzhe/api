import { CoolController, BaseController } from '@cool-midway/core';
import { MsgInfoEntity } from '../../entity/info';
import { Inject } from '@midwayjs/core';
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
  },
})
export class AdminMsgInfoController extends BaseController {
  @Inject()
  msgInfoService: MsgInfoService;

  @Inject()
  ctx;
}
