import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { AiAppEntity } from '../entity/app';

/**
 * Ai应用
 */
@Provide()
export class AiAppService extends BaseService {
  @InjectEntityModel(AiAppEntity)
  aiAppEntity: Repository<AiAppEntity>;

  /**
   * 根据ID获取
   * @param appId 应用ID
   */
  async getApp(appId: number) {
    const app = await this.aiAppEntity.findOneBy({
      id: Equal(appId),
      status: 1,
    });
    return app;
  }
}
