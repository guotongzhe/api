import {
  WSController,
  OnWSConnection,
  Inject,
  OnWSMessage,
} from '@midwayjs/decorator';
import { AiSocketTokenMiddleware } from './middleware/token';
import { AiSessionService } from '../service/session';
import { SOCKET_SYS } from '../constant/socket';

/**
 * AI Socket 连接
 */
@WSController('/ai')
export class AiSocketIoController {
  @Inject()
  ctx;

  @Inject()
  aiSessionService: AiSessionService;

  // 客户端连接
  @OnWSConnection({ middleware: [AiSocketTokenMiddleware] })
  async onConnectionMethod() {
    this.ctx.emit(SOCKET_SYS, '连接成功');
  }

  // 发送消息
  @OnWSMessage('send', { middleware: [AiSocketTokenMiddleware] })
  async send(data) {
    const { isAdmin, userId } = this.ctx.connData;
    data = {
      ...data,
      isAdmin,
      objectId: userId,
    };
    await this.aiSessionService.stream(data, this.ctx);
  }
}
