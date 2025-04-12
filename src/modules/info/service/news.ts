import { BaseService } from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InfoNewsEntity } from '../entity/news';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

@Provide()
export class InfoNewsService extends BaseService {
  @InjectEntityModel(InfoNewsEntity)
  infoNewsEntity: Repository<InfoNewsEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.infoNewsEntity);
  }

  /**
   * 详情
   */
  async info(param) {
    this.infoNewsEntity.increment({ id: param }, 'view', 1);
    return await super.info(param);
  }
}
