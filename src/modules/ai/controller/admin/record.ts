import { CoolController, BaseController } from '@cool-midway/core';
import { AiRecordEntity } from '../../entity/record';
import { UserInfoEntity } from '../../../user/entity/info';
import { AiAppEntity } from '../../entity/app';
import { Body, Inject, Post } from '@midwayjs/core';
import { AiRecordService } from '../../service/record';
import { BaseSysUserEntity } from '../../../base/entity/sys/user';

/**
 * AI记录
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: AiRecordEntity,
  service: AiRecordService,
  pageQueryOp: {
    keyWordLikeFields: ['c.name', 'a.objectId', 'b.nickName', 'd.name'],
    fieldEq: ['a.appId', 'a.type', 'a.role'],
    select: [
      'a.*',
      'b.nickName as userName',
      'c.name as appName',
      'c.logo as appLogo',
      'd.name as adminName',
    ],
    join: [
      {
        entity: UserInfoEntity,
        alias: 'b',
        condition: 'a.objectId = b.id and a.type = 0',
      },
      {
        entity: AiAppEntity,
        alias: 'c',
        condition: 'a.appId = c.id',
      },
      {
        entity: BaseSysUserEntity,
        alias: 'd',
        condition: 'a.objectId = d.id and a.type = 1',
      },
    ],
    where: ctx => {
      const { isAdmin } = ctx.request.body;
      return [
        [
          'a.objectId =:objectId and a.type =:type',
          { objectId: ctx.admin?.userId, type: 1 },
          ctx.admin?.userId && isAdmin,
        ],
      ];
    },
  },
})
export class AiRecordController extends BaseController {
  @Inject()
  aiRecordService: AiRecordService;

  @Inject()
  ctx;

  @Post('/clear', { summary: '清空' })
  async clear(@Body('appId') appId: number) {
    const objectId = this.ctx.admin.userId;
    return this.ok(await this.aiRecordService.clear(objectId, appId, [1]));
  }
}
