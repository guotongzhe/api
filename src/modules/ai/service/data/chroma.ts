import {
  Config,
  ILogger,
  Inject,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { ChromaClient } from 'chromadb';
import { AiDataEmbedding } from './embedding';
import { CoolCommException } from '@cool-midway/core';

/**
 * AI chroma 向量搜索引擎
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class AiDataChroma {
  client: ChromaClient;

  @Config('module.ai.chroma')
  config;

  @Inject()
  aiDataEmbedding: AiDataEmbedding;

  @Inject()
  logger: ILogger;

  /**
   * 初始化
   */
  async init() {
    this.client = new ChromaClient({ path: this.config.url });
    await this.aiDataEmbedding.init();
    this.logger.info('模块[ai]，知识库就绪');
  }

  /**
   * 操作集合
   * @param name
   * @param type
   */
  async collection(name: string, type: 'create' | 'delete' | 'get') {
    if (type === 'create') {
      await this.client.createCollection({
        name,
        embeddingFunction: this.aiDataEmbedding,
        metadata: { 'hnsw:space': this.config.distance },
      });
    }
    if (type === 'delete') {
      await this.client.deleteCollection({
        name,
      });
    }
    if (type === 'get') {
      return await this.client.getCollection({
        name,
        embeddingFunction: this.aiDataEmbedding,
      });
    }
  }

  /**
   * 操作数据
   * @param collectionName
   * @param data
   * @param type
   */
  async data(collectionName: string, data: any, type: 'upsert' | 'delete') {
    await this.batchData(collectionName, [data], type);
  }

  /**
   * 批量操作数据
   * @param collectionName
   * @param data
   * @param type
   */
  async batchData(
    collectionName: string,
    data: any[],
    type: 'upsert' | 'delete'
  ) {
    const collection = await this.collection(collectionName, 'get');
    if (type === 'upsert') {
      await collection.upsert({
        ids: data.map(e => `id_${e.id}`),
        metadatas: data.map(e => {
          return {
            ...e,
            tags: e.tags.join(','),
          };
        }),
        documents: data.map(e => {
          return `
          ${e.title}
          ${e.description}
          ${e.content}
          ${e.tags.join(',')}`;
        }),
      });
    }
    if (type == 'delete') {
      await collection.delete({ ids: data.map(id => `id_${id}`) });
    }
  }

  /**
   * 搜索
   * @param collectionName
   * @param text
   * @param nResults
   * @param filterDistance 过滤大与该距离的结果
   */
  async search(
    collectionName: string,
    text: string,
    options: {
      nResults?: number;
      filterDistance?: number;
    } = {
      nResults: this.config.nResults,
    }
  ) {
    text = JSON.stringify({ isSearch: true, text });
    const { nResults, filterDistance } = {
      nResults: this.config.nResults,
      ...options,
    };
    const collection = await this.collection(collectionName, 'get');
    const data: any = await collection.query({
      nResults,
      queryTexts: [text],
    });
    if (data.error) {
      throw new CoolCommException(
        '搜索失败，如果你更换了AI引擎，必须到知识库列表点重建索引按钮重建索引'
      );
    }
    if (!filterDistance) {
      return data;
    } else {
      // 找出要删除的数据的数组下标
      const deleteIndex = [];
      const distances = data.distances[0];
      for (let i = 0; i < distances.length; i++) {
        if (distances[i] > filterDistance) {
          deleteIndex.push(i);
        }
      }
      // 删除data.documents 和 data.metadatas 对应的下标
      for (let i = deleteIndex.length - 1; i >= 0; i--) {
        data.ids[0].splice(deleteIndex[i], 1);
        data.distances[0].splice(deleteIndex[i], 1);
        data.documents[0].splice(deleteIndex[i], 1);
        data.metadatas[0].splice(deleteIndex[i], 1);
      }
      return data;
    }
  }
}
