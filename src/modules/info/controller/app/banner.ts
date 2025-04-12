import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { InfoBannerEntity } from '../../entity/banner';

/**
 * 轮播图
 */
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['list'],
})
@CoolController({
  api: ['list'],
  entity: InfoBannerEntity,
  pageQueryOp: {
    where: () => {
      return [['a.status', '=', 1]];
    },
  },
})
export class AppInfoBannerController extends BaseController {}
