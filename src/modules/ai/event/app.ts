import { CoolEvent, Event } from '@cool-midway/core';
import { Inject } from '@midwayjs/core';
import { AiDataChroma } from '../service/data/chroma';
import { EVENT_PLUGIN_READY } from '../../plugin/service/center';
import { AiEngineService } from '../service/engine';

/**
 * 应用事件
 */
@CoolEvent()
export class AiAppEvent {
  @Inject()
  aiDataChroma: AiDataChroma;

  @Inject()
  aiEngineService: AiEngineService;

  isReady = false;

  @Event(EVENT_PLUGIN_READY)
  async onPluginReady() {
    await this.aiEngineService.init();
    this.aiDataChroma.init();
  }
}
