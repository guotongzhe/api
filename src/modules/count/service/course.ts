import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CourseInfoEntity } from '../../course/entity/info';
import { CourseItemEntity } from '../../course/entity/item';

/**
 * 课程统计
 */
@Provide()
export class CountCourseService extends BaseService {
  @InjectEntityModel(CourseInfoEntity)
  courseInfoEntity: Repository<CourseInfoEntity>;

  @InjectEntityModel(CourseItemEntity)
  courseItemEntity: Repository<CourseItemEntity>;

  /**
   * 概况
   */
  async summary() {
    // 课程总数
    const courseCount = await this.courseInfoEntity.count();

    // 章节总数
    const itemCount = await this.courseItemEntity.count();

    return {
      courseCount,
      itemCount,
    };
  }
}
