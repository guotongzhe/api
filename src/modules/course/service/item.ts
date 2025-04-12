import { Init, Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { CourseInfoEntity } from '../entity/info';
import { CourseItemEntity } from '../entity/item';
import { OrderInfoEntity } from '../../order/entity/info';

/**
 * 课程信息
 */
@Provide()
export class CourseItemService extends BaseService {
  @InjectEntityModel(CourseInfoEntity)
  courseInfoEntity: Repository<CourseInfoEntity>;

  @InjectEntityModel(CourseItemEntity)
  courseItemEntity: Repository<CourseItemEntity>;

  @InjectEntityModel(OrderInfoEntity)
  orderInfoEntity: Repository<OrderInfoEntity>;

  @Inject()
  ctx;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.courseInfoEntity);
  }

  // 更新章节数
  async modifyAfter(data) {
    const num = await this.courseItemEntity.countBy({
      courseId: data.courseId,
    });

    this.courseInfoEntity.update(
      {
        id: data.courseId,
      },
      {
        num,
      }
    );
  }

  /**
   * 列表
   * @param query
   * @param option
   * @param connectionName
   * @returns
   */
  async list(query: any, option: any, connectionName?: any) {
    const items: CourseItemEntity[] = await super.list(
      query,
      option,
      connectionName
    );
    // 客户端获取
    if (this.ctx.user) {
      const { courseId } = query;
      const userId = this.ctx.user.id;
      const canLook = await this.canLook(userId, courseId);
      if (!canLook) {
        // 不能查看 去除视频地址
        items.forEach(item => {
          if (item.preview != 1) {
            item.videoUrl = null;
          }
        });
      }
    }
    return items;
  }

  /**
   * 判断是否课程查看课程
   * @param userId
   * @param courseId
   * @returns
   */
  async canLook(userId: number, courseId: number) {
    const course = await this.courseInfoEntity.findOneBy({
      id: Equal(courseId),
      status: 1,
    });
    if (!course) {
      throw new CoolCommException('课程不存在');
    }
    if (course.price == 0) {
      return true;
    }
    const order = await this.orderInfoEntity.findOneBy({
      userId: Equal(userId),
      courseId: Equal(courseId),
      status: 1,
    });
    return !!order;
  }
}
