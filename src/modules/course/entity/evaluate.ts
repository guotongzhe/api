import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 课程-评论
 */
@Entity('course_evaluate')
export class CourseEvaluateEntity extends BaseEntity {
  @Index()
  @Column({ comment: '课程ID' })
  courseId: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '评分', default: 0 })
  star: number;

  @Column({ comment: '内容' })
  content: string;
}
