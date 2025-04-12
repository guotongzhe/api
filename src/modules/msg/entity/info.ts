import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 消息通知
 */
@Entity('msg_info')
export class MsgInfoEntity extends BaseEntity {
  @Column({ comment: '标题' })
  title: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '数据', type: 'json', nullable: true })
  data: Object;

  @Column({ comment: '已读人数', default: 0 })
  readCount: number;

  @Column({ comment: '类型 0-指定人员 1-所有人', default: 0 })
  type: number;

  @Column({ comment: '接收的用户ID', type: 'json', nullable: true })
  toUserIds: number[];
}
