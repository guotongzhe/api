import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * AI模块上下文
 */
@Entity('ai_record')
export class AiRecordEntity extends BaseEntity {
  @Index()
  @Column({ comment: '应用ID' })
  appId: number;

  @Index()
  @Column({ comment: '对象ID' })
  objectId: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '角色', default: 'user' })
  role: 'user' | 'assistant';

  @Column({ comment: '类型 0-用户 1-后台 2-通用', default: 0 })
  type: number;
}
