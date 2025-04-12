import { ILogger, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { PluginService } from '../../../plugin/service/info';
import { AiEngineService } from '../engine';
import { CoolCommException } from '@cool-midway/core';

/**
 * 向量化
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class AiDataEmbedding {
  @Inject()
  pluginService: PluginService;

  @Inject()
  aiEngineService: AiEngineService;

  engine;

  plugin;

  @Inject()
  logger: ILogger;

  /**
   * 初始化
   */
  async init() {
    this.engine = this.aiEngineService.getEngine();
    try {
      this.plugin = await this.pluginService.getInstance(this.engine);
    } catch (err) {
      this.logger.error(
        `模块[ai]，请下载安装AI引擎插件，支持：${this.aiEngineService.supports.join(
          ','
        )}`
      );
    }
  }

  /**
   * 向量化
   * @param texts
   * @returns
   */
  public async generate(texts: string[]): Promise<number[][]> {
    try {
      let type = 'db';
      if (texts.length == 1) {
        const obj = this.parseJSON(texts[0]);
        if (obj && obj.isSearch) {
          type = 'query';
          texts = [obj.text];
        }
      }
      const result = await this.plugin.embeddings(texts, { type });
      return result;
    } catch (err) {
      throw new CoolCommException(
        '模块[ai]，向量化失败，可能是接口调用频率过高，请查看咨询对应AI引擎提供商'
      );
    }
  }

  /**
   * 解析JSON
   * @param str
   * @returns
   */
  parseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }
}
