import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { BaseService } from '@cool-midway/core';
import { AiRecordEntity } from '../entity/record';
import { BaseSysParamService } from '../../base/service/sys/param';

/**
 * AI 记录
 */
@Provide()
export class AiRecordService extends BaseService {
  @InjectEntityModel(AiRecordEntity)
  aiRecordEntity: Repository<AiRecordEntity>;

  @Inject()
  baseSysParamService: BaseSysParamService;

  /**
   * 清空记录
   * @param objectId
   * @param appId
   * @param types
   */
  async clear(objectId: string, appId: number, types: number[]) {
    await this.aiRecordEntity.delete({
      objectId: Equal(objectId),
      appId: Equal(appId),
      type: In(types),
    });
  }

  /**
   * 分页
   * @param query
   * @param option
   * @param connectionName
   * @returns
   */
  async page(
    query: any,
    option: any,
    connectionName?: any
  ): Promise<{
    list: any;
    pagination: { page: number; size: number; total: number };
  }> {
    const result = await super.page(query, option, connectionName);
    result.list.forEach(item => {
      if (item.type == 1) {
        item.userName = item.adminName;
      }
    });
    return result;
  }

  /**
   * 历史记录
   * @param objectId 对象ID，可以是用户ID
   * @param appId 应用ID
   * @returns
   */
  async history(objectId: string, appId: number) {
    const aiContextCount = await this.baseSysParamService.dataByKey(
      'aiContextCount'
    );
    const list = await this.aiRecordEntity
      .createQueryBuilder('a')
      .where('a.objectId = :objectId and a.appId = :appId', { objectId, appId })
      .orderBy('a.id', 'DESC')
      .limit(aiContextCount)
      .getMany();
    // 反转数组
    list.reverse();
    return list.map(item => {
      return {
        role: item.role,
        content: item.content,
      };
    });
  }

  /**
   * 保存
   * @param role
   * @param content
   * @param userId
   */
  async save(data: {
    role: 'user' | 'assistant';
    content: string;
    objectId: string;
    appId: number;
    type: number;
  }) {
    await this.aiRecordEntity.save(data);
  }
}
