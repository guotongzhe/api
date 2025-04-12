import { Config, Init, Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { AiRecordService } from './record';
import { Context } from '@midwayjs/socketio';
import { AiAppEntity } from '../entity/app';
import { AiAppService } from './app';
import { SOCKET_MSG, SOCKET_SYS } from '../constant/socket';
import { PluginService } from '../../plugin/service/info';
import { AiDataService } from './data/info';
import * as _ from 'lodash';
import { AiEngineService } from './engine';

/**
 * AI 会话
 */
@Provide()
export class AiSessionService extends BaseService {
  @Inject()
  aiRecordService: AiRecordService;

  @Inject()
  aiAppService: AiAppService;

  @Inject()
  pluginService: PluginService;

  @Inject()
  aiDataService: AiDataService;

  @Inject()
  aiEngineService: AiEngineService;

  engine;

  @Config('module.ai.chroma.nResults')
  nResults: number;

  @Init()
  async init() {
    this.engine = this.aiEngineService.getEngine();
  }

  /**
   * 普通调用
   * @param data
   * @returns
   */
  async comm(data: {
    objectId: string;
    isAdmin: boolean;
    appId: number;
    content: string;
  }) {
    const { objectId, isAdmin, appId } = data;
    const app = await this.aiAppService.getApp(appId);
    if (!app) {
      throw new CoolCommException('应用不存在或被禁用');
    }
    const messages = await this.getMessages(data, app);
    const aiEngine = await this.pluginService.getInstance(this.engine);
    const result = await aiEngine.chat(messages);
    const content = result.reply;
    this.aiRecordService.save({
      role: 'assistant',
      content,
      objectId,
      appId,
      type: isAdmin ? 1 : 0,
    });
    return content;
  }

  /**
   * 流式调用
   * @param data
   * @param socket
   */
  async stream(data: any, socket: Context) {
    const { objectId, isAdmin, appId } = data;
    const app = await this.aiAppService.getApp(appId);
    try {
      if (!app) {
        socket.emit(SOCKET_SYS, '应用不存在或被禁用');
      }
      const messages = await this.getMessages(data, app);
      const aiEngine = await this.pluginService.getInstance(this.engine);
      let content = '';
      aiEngine.chat(messages, { stream: true }, data => {
        socket.emit(SOCKET_MSG, { ...data, appId });
        if (!data.isEnd) {
          content += data.content;
        }
        if (data.isEnd && app.isContext) {
          this.aiRecordService.save({
            role: 'assistant',
            content,
            objectId,
            appId,
            type: isAdmin ? 1 : 0,
          });
        }
      });
    } catch (error) {
      socket.emit(SOCKET_MSG, {
        isEnd: true,
        content: '[系统错误]' + error.message,
        appId,
      });
    }
  }

  /**
   * 获取消息
   * @param data
   * @param app
   */
  async getMessages(data: any, app: AiAppEntity) {
    const { content, objectId, isAdmin, appId } = data;
    // 问题
    const question = { role: 'user', content };
    // 系统信息
    const system = await this.knowledge(
      { role: 'system', content: app.prompt },
      app,
      content
    );

    const messages = [system];
    // 有开启上下文
    if (app.isContext) {
      const contexts = await this.aiRecordService.history(objectId, appId);
      messages.push(...contexts);
      messages.push(question);
      // 保存记录
      await this.aiRecordService.save({
        role: 'user',
        content,
        objectId,
        appId,
        type: isAdmin ? 1 : 0,
      });
    } else {
      messages.push(question);
    }
    return messages;
  }

  /**
   * 知识库
   * @param message
   * @param app
   * @param text 问题
   * @returns
   */
  async knowledge(
    message: { role: 'system'; content: string },
    app: AiAppEntity,
    text: string
  ) {
    // 关联知识库
    if (app.dataId) {
      const { metadatas } = await this.aiDataService.search(
        app.dataId,
        text,
        this.nResults
      );
      if (!_.isEmpty(metadatas)) {
        const datas = metadatas[0];
        if (_.isEmpty(datas)) {
          return message;
        }
        return {
          role: 'system',
          content: `
         ${message.content}
          
          Additional Information (The following details are sourced from a knowledge database. Use your discretion to determine their relevance to the question. If deemed unrelated, please disregard.)：
          ${datas
            .map(
              e => `
          title: ${e.title}
          description: ${e.description}
          tags: ${e.tags}
          content: ${e.content}
          `
            )
            .join('\n')} 
          `,
        };
      }
    }
    return message;
  }
}
