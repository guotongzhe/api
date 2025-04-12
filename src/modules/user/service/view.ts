import { Init, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { UserViewEntity } from '../entity/view';

/**
 * 用户观看
 */
@Provide()
export class UserViewService extends BaseService {
  @InjectEntityModel(UserViewEntity)
  userViewEntity: Repository<UserViewEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.userViewEntity);
  }

  /**
   * 浏览记录
   * @param userId
   * @param courseId
   */
  async record(courseId: number, data: any, userId: number) {
    const info = await this.userViewEntity.findOneBy({
      userId: Equal(userId),
      courseId: Equal(courseId),
    });
    if (info) {
      await this.userViewEntity.update(info.id, {
        data,
        updateTime: new Date(),
      });
    } else {
      await this.userViewEntity.save({
        userId,
        courseId,
        data,
        updateTime: new Date(),
      });
    }
  }
}
