import { Init, Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { MsgInfoEntity } from '../entity/info';
import { MsgUserEntity } from '../entity/user';
import { UserInfoEntity } from '../../user/entity/info';
import { PluginService } from '../../plugin/service/info';
import { MsgDeviceEntity } from '../entity/device';

/**
 * 通知公告
 */
@Provide()
export class MsgInfoService extends BaseService {
  @InjectEntityModel(MsgInfoEntity)
  msgInfoEntity: Repository<MsgInfoEntity>;

  @InjectEntityModel(MsgUserEntity)
  msgUserEntity: Repository<MsgUserEntity>;

  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @InjectEntityModel(MsgDeviceEntity)
  msgDeviceEntity: Repository<MsgDeviceEntity>;

  @Inject()
  pluginService: PluginService;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.msgInfoEntity);
  }

  /**
   * 重写新增
   * @param data
   * @returns
   */
  async add(data: {
    toUserIds: number[];
    type: 0 | 1;
    id: number;
    title: string;
    content: string;
  }) {
    const res = await super.add(data);

    // 用户列表
    let ids = [];

    // 指定发送
    if (data.type == 0) {
      ids = data.toUserIds;

      data.toUserIds.forEach(userId => {
        this.msgUserEntity.save({
          userId,
          infoId: data.id,
        });
      });
    }

    // 所有发送
    if (data.type == 1) {
      const users = await this.userInfoEntity.findBy({ status: 1 });
      ids = users.map(e => e.id);

      for (const user of users) {
        this.msgUserEntity.save({
          userId: user.id,
          infoId: data.id,
        });
      }
    }

    // 推送插件
    const unipush = await this.pluginService.getInstance('unipush');

    // 设备列表
    const devices = await this.msgDeviceEntity.findBy({
      userId: In(ids),
    });

    ids.forEach(async id => {
      const device = devices.find(e => e.userId == id);

      if (device) {
        try {
          await unipush.pushCid(data.title, data.content, device.cid, data);
        } catch (e) {}
      }
    });

    return res;
  }

  // 获取未读数量
  async unreadCount(userId: number) {
    return await this.msgUserEntity.countBy({ userId, status: 0 });
  }

  /**
   * 已读
   * @param userId
   * @param infoId
   */
  async read(userId: number, infoIds: number[]) {
    await this.msgUserEntity.update(
      { userId, infoId: In(infoIds) },
      { status: 1 }
    );
    for (const infoId of infoIds) {
      const count = await this.msgUserEntity.countBy({
        infoId,
        status: 1,
      });
      await this.msgInfoEntity.update(infoId, { readCount: count });
    }
  }

  /**
   * 全部已读
   * @param userId
   */
  async clear(userId: number) {
    const list = await this.msgUserEntity.findBy({
      userId,
    });

    const infoIds = list.map(e => e.infoId);

    await this.msgUserEntity.update(
      { userId, infoId: In(infoIds) },
      { status: 1 }
    );
    for (const infoId of infoIds) {
      const count = await this.msgUserEntity.countBy({
        infoId,
        status: 1,
      });
      await this.msgInfoEntity.update(infoId, { readCount: count });
    }
  }
}
