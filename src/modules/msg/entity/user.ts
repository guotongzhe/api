import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户消息
 */
@Entity('msg_user')
export class MsgUserEntity extends BaseEntity {
  @Index()
  @Column({ comment: '消息ID' })
  infoId: number;

  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '状态 0-已读 1-未读', default: 0 })
  status: number;

  @Column({ comment: '阅读时间', nullable: true })
  readTime: Date;
}
