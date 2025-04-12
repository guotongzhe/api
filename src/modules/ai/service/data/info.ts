import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { AiDataInfoEntity } from '../../entity/data/info';
import { AiDataChroma } from './chroma';

/**
 * AI 数据
 */
@Provide()
export class AiDataService extends BaseService {
  @InjectEntityModel(AiDataInfoEntity)
  aiDataInfoEntity: Repository<AiDataInfoEntity>;

  @Inject()
  aiDataChroma: AiDataChroma;

  /**
   * 搜索
   * @param typeId 类型ID
   * @param text 内容
   * @param nResults 返回条数
   * @returns
   */
  async search(typeId: number, text: string, nResults = 10) {
    if (!typeId || !text) throw new Error('内容不能为空');
    return await this.aiDataChroma.search(`COOL_${typeId}`, text, { nResults });
  }

  /**
   * 修改之后
   * @param data
   * @param type
   */
  async modifyAfter(data: any, type: 'add' | 'update' | 'delete') {
    if (type == 'add') {
      await this.aiDataChroma.data(`COOL_${data.typeId}`, data, 'upsert');
    }
    if (type == 'update') {
      const info = await this.aiDataInfoEntity.findOneBy({ id: data.id });
      if (info.enable == 0) {
        await this.aiDataChroma.data(`COOL_${info.typeId}`, info.id, 'delete');
        await this.aiDataInfoEntity.update(info.id, { status: 0 });
      } else {
        await this.aiDataChroma.data(`COOL_${info.typeId}`, info, 'upsert');
        await this.aiDataInfoEntity.update(info.id, { status: 1 });
      }
    }
  }

  /**
   * 删除
   * @param ids
   */
  async delete(ids: any) {
    const info = await this.aiDataInfoEntity.findOneBy({ id: ids[0] });
    await this.aiDataChroma.batchData(`COOL_${info.typeId}`, ids, 'delete');
    await super.delete(ids);
  }
}
