import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MsgDeviceEntity } from '../entity/device';

/**
 * 用户设备
 */
@Provide()
export class MsgDeviceService extends BaseService {
  @InjectEntityModel(MsgDeviceEntity)
  msgDeviceEntity: Repository<MsgDeviceEntity>;

  async bind(data: any, userId: number) {
    const user = await this.msgDeviceEntity.findOneBy({
      userId,
      type: data.type,
    });

    if (user) {
      this.msgDeviceEntity.update(user.id, data);
    } else {
      this.msgDeviceEntity.insert({
        ...data,
        userId,
      });
    }
  }
}
