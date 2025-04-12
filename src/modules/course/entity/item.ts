import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 课程-节
 */
@Entity('course_item')
export class CourseItemEntity extends BaseEntity {
  @Index()
  @Column({ comment: '课程ID' })
  courseId: number;

  @Column({ comment: '标题' })
  title: string;

  @Column({ comment: '视频地址' })
  videoUrl: string;

  @Column({ comment: '时长' })
  duration: number;

  @Column({ comment: '排序', default: 0 })
  sortNum: number;

  @Column({ comment: '试看 0-否 1-是', default: 0 })
  preview: number;
}
