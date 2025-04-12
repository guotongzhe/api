import { Config, Inject, Provide } from '@midwayjs/decorator';
import { PluginService } from '../../plugin/service/info';
import { ILogger, Scope, ScopeEnum } from '@midwayjs/core';

/**
 * 引擎
 */
@Provide()
@Scope(ScopeEnum.Singleton, { allowDowngrade: true })
export class AiEngineService {
  @Config('module.ai.engine')
  engineConfig;

  engine;

  @Inject()
  pluginService: PluginService;

  @Config('module.ai.supports')
  supports;

  @Inject()
  logger: ILogger;

  /**
   * 初始化引擎
   */
  async init() {
    if (this.engineConfig) {
      this.engine = this.engineConfig;
      this.logger.info(`模块[ai]，采用AI引擎: ${this.engine}`);
      return;
    }

    for (const engine of this.supports) {
      try {
        await this.pluginService.getInstance(engine);
        this.engine = engine;
        this.logger.info(`模块[ai]，采用AI引擎: ${engine}`);
        break;
      } catch (e) {
        continue;
      }
    }
  }

  /**
   * 获得引擎
   */
  getEngine() {
    return this.engine;
  }
}
