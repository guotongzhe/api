import { CoolController, BaseController } from '@cool-midway/core';
import { MsgDeviceEntity } from '../../entity/device';
import { Body, Inject, Post } from '@midwayjs/core';
import { MsgDeviceService } from '../../service/device';

/**
 * 用户设备
 */
@CoolController({
  api: [],
  entity: MsgDeviceEntity,
  service: MsgDeviceService,
})
export class AppMsgDeviceController extends BaseController {
  @Inject()
  msgDeviceService: MsgDeviceService;

  @Inject()
  ctx;

  @Post('/bind')
  async bind(@Body() data: any) {
    this.msgDeviceService.bind(data, this.ctx.user.id);
    return this.ok();
  }
}
