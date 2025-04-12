import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户浏览
 */
@Entity('user_view')
export class UserViewEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '课程ID' })
  courseId: number;

  @Column({ comment: '数据', type: 'json', nullable: true })
  data: any;
}
