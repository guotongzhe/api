import { Init, Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEvaluateEntity } from '../entity/evaluate';

/**
 * 课程评价
 */
@Provide()
export class CourseEvaluateService extends BaseService {
  @InjectEntityModel(CourseEvaluateEntity)
  courseEvaluateEntity: Repository<CourseEvaluateEntity>;

  @Inject()
  ctx;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.courseEvaluateEntity);
  }

  /**
   * 获取评论列表
   */
  async page(query: any, option: any, connectionName?: any): Promise<any> {
    const res = await super.page(query, option, connectionName);

    // 求评分平均值
    const score = await this.courseEvaluateEntity
      .createQueryBuilder('a')
      .select('AVG(a.star)', 'avgScore')
      .where('a.courseId = :courseId', {
        courseId: query.courseId,
      })
      .getRawOne();

    return {
      ...res,
      subData: {
        score: score.avgScore,
      },
    };
  }

  /**
   * 提交评论
   * @param data
   * @param userId
   */
  async submit(data: any, userId: number) {
    return await this.courseEvaluateEntity.insert({
      ...data,
      userId,
    });
  }
}
