import { Init, Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CourseInfoEntity } from '../entity/info';
import { OrderInfoEntity } from '../../order/entity/info';

/**
 * 课程信息
 */
@Provide()
export class CourseInfoService extends BaseService {
  @InjectEntityModel(CourseInfoEntity)
  courseInfoEntity: Repository<CourseInfoEntity>;

  @InjectEntityModel(OrderInfoEntity)
  orderInfoEntity: Repository<OrderInfoEntity>;

  @Inject()
  ctx;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.courseInfoEntity);
  }

  async info(id: any, infoIgnoreProperty?: string[]): Promise<any> {
    const info = await super.info(id, infoIgnoreProperty);

    if (this.ctx.user) {
      info.order = await this.orderInfoEntity.findOneBy({
        courseId: id,
        userId: this.ctx.user.id,
        status: 1,
      });
    }

    return info;
  }
}
