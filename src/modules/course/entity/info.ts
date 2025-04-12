import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 课程信息
 */
@Entity('course_info')
export class CourseInfoEntity extends BaseEntity {
  @Index()
  @Column({ comment: '标题' })
  title: string;

  @Column({ comment: '封面' })
  cover: string;

  @Column({ comment: '简介' })
  description: string;

  @Column({ comment: '价格', type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({
    comment: '原价',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  originalPrice: number;

  @Column({ comment: '课程分类' })
  typeId: number;

  @Column({ comment: '节数', default: 0 })
  num: number;

  @Column({ comment: '排序', default: 0 })
  sortNum: number;

  @Column({ comment: '课程标签', type: 'json', nullable: true })
  tags: string[];

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}
