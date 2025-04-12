import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import { CoolCacheStore } from '@cool-midway/core';

import { createAdapter } from '@socket.io/redis-adapter';
// @ts-ignore
import Redis from 'ioredis';

const redis = {
  host: '127.0.0.1',
  port: 6379,
  password: '',
  db: 1,
};

const pubClient = new Redis(redis);
const subClient = pubClient.duplicate();

// redis缓存
// import { redisStore } from 'cache-manager-ioredis-yet';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '0f08b56010c711ef9ba7ffb806ba1802',
  socketIO: {
    upgrades: ['websocket'], // 可升级的协议
    adapter: createAdapter(pubClient, subClient),
  },
  koa: {
    port: 8007,
  },
  // 模板渲染
  view: {
    mapping: {
      '.html': 'ejs',
    },
  },
  // 静态文件配置
  staticFile: {
    buffer: true,
  },
  // 文件上传
  upload: {
    fileSize: '200mb',
    whitelist: null,
  },
  // 缓存 可切换成其他缓存如：redis http://www.midwayjs.org/docs/extensions/caching
  cacheManager: {
    clients: {
      default: {
        store: CoolCacheStore,
        options: {
          path: 'cache',
          ttl: 0,
        },
      },
    },
  },
  // cacheManager: {
  //   clients: {
  //     default: {
  //       store: redisStore,
  //       options: {
  //         port: 6379,
  //         host: '127.0.0.1',
  //         password: '',
  //         ttl: 0,
  //         db: 0,
  //       },
  //     },
  //   },
  // },
  cool: {
    redis,
    // 已经插件化，本地文件上传查看 plugin/config.ts，其他云存储查看对应插件的使用
    file: {},
    // crud配置
    crud: {
      // 插入模式，save不会校验字段(允许传入不存在的字段)，insert会校验字段
      upsert: 'save',
      // 软删除
      softDelete: true,
    },
  } as CoolConfig,
} as MidwayConfig;
