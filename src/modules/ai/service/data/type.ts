import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { AiDataInfoEntity } from '../../entity/data/info';
import { AiDataChroma } from './chroma';
import { ILogger } from '@midwayjs/core';
import { AiDataTypeEntity } from '../../entity/data/type';

/**
 * AI 数据类型
 */
@Provide()
export class AiDataTypeService extends BaseService {
  @InjectEntityModel(AiDataInfoEntity)
  aiDataInfoEntity: Repository<AiDataInfoEntity>;

  @InjectEntityModel(AiDataTypeEntity)
  aiDataTypeEntity: Repository<AiDataTypeEntity>;

  @Inject()
  aiDataChroma: AiDataChroma;

  @Inject()
  logger: ILogger;

  /**
   * 删除
   * @param ids
   */
  async delete(ids: any) {
    await super.delete(ids);
    // 删除关联数据
    await this.aiDataInfoEntity.delete({ typeId: In(ids) });
    // 删除集合
    for (const id of ids) {
      await this.aiDataChroma.collection(`COOL_${id}`, 'delete');
    }
  }

  /**
   * 新增
   * @param param
   * @returns
   */
  async add(param: any) {
    const result = await super.add(param);
    // 创建集合
    await this.aiDataChroma.collection(`COOL_${param.id}`, 'create');
    return result;
  }

  /**
   * 重建
   * @param param
   * @returns
   */
  async rebuild(typeId: number) {
    const info = await this.aiDataTypeEntity.findOneBy({ id: typeId });
    // 删除集合
    await this.aiDataChroma.collection(`COOL_${typeId}`, 'delete');
    // 创建集合
    await this.aiDataChroma.collection(`COOL_${typeId}`, 'create');
    // 重建数据
    await this.aiDataInfoEntity.update(
      { typeId: Equal(typeId) },
      { status: 0 }
    );
    let build = true;
    while (build) {
      try {
        const list = await this.aiDataInfoEntity
          .createQueryBuilder('a')
          .where('a.typeId = :typeId AND a.status = 0 AND a.enable = 1', {
            typeId,
          })
          .limit(5)
          .getMany();
        if (list.length === 0) {
          build = false;
          break;
        }
        await this.aiDataChroma.batchData(`COOL_${typeId}`, list, 'upsert');
        await this.aiDataInfoEntity.update(
          { id: In(list.map(e => e.id)) },
          { status: 1 }
        );
      } catch (err) {
        continue;
      }
    }
    this.logger.info(`模块[ai]，知识库[${info.name}]重建数据完成`);
  }
}
