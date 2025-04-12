import { CoolController, BaseController } from '@cool-midway/core';
import { InfoBannerEntity } from '../../entity/banner';

/**
 * 轮播图
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: InfoBannerEntity,
})
export class AdminInfoBannerController extends BaseController {}
