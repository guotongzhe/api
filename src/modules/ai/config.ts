import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: 'AI模块',
    // 模块描述
    description: 'AI管理模块，知识库索引、智能决策、聊天等',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
    // 支持的AI引擎
    supports: ['zhipu', 'minimax', 'ollama', 'tongyi'],
    // chroma 向量数据库配置
    chroma: {
      // 向量搜索引擎地址
      url: 'http://127.0.0.1:8000',
      // 距离计算方式 可选 l2、cosine、ip
      distance: 'l2',
      // 返回数据数量
      nResults: 3,
    },
    // 如果安装多个AI引擎(默认会取一个),可以手动指定，AI插件的key
    engine: '',
  } as ModuleConfig;
};
