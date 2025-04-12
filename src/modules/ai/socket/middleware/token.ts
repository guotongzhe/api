import { Config, Middleware } from '@midwayjs/core';
import { NextFunction } from '@midwayjs/socketio';
import * as jwt from 'jsonwebtoken';
import { SOCKET_SYS } from '../../constant/socket';

@Middleware()
export class AiSocketTokenMiddleware {
  @Config('module.user.jwt')
  appJwtConfig;

  @Config('module.base.jwt')
  adminJwtConfig;

  resolve() {
    return async (ctx, next: NextFunction) => {
      try {
        // 获得连接参数
        const isAdmin = ctx.handshake.auth.isAdmin;
        const token = ctx.handshake.auth.token;
        const data = jwt.verify(
          token,
          isAdmin ? this.adminJwtConfig.secret : this.appJwtConfig.secret
        );
        ctx.connData = {
          userId: isAdmin ? data.userId : data.id,
          isAdmin,
        };
      } catch (error) {
        ctx.emit(SOCKET_SYS, '连接失败');
        return;
      }
      // 这边可以写一些逻辑，比如校验token
      return await next();
    };
  }
}
