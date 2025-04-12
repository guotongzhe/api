import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 规格
 */
@Entity('course_type')
export class CourseTypeEntity extends BaseEntity {
  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '排序', default: 0, nullable: true })
  sortNum: number;

  @Column({ comment: '图片', nullable: true })
  pic: string;

  @Column({ comment: '状态  0-禁用 1-启用', nullable: true, default: 1 })
  status: number;
}
