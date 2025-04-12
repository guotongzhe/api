import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * AI 数据
 */
@Entity('ai_data_info')
export class AiDataInfoEntity extends BaseEntity {
  @Index()
  @Column({ comment: '类型ID' })
  typeId: number;

  @Column({ comment: '标题', nullable: true })
  title: string;

  @Column({ comment: '描述', nullable: true })
  description: string;

  @Column({ comment: '标签', type: 'json', nullable: true })
  tags: string[];

  @Column({ comment: '内容', type: 'longtext' })
  content: string;

  @Column({ comment: '状态 0-准备中 1-已就绪', default: 1 })
  status: number;

  @Column({ comment: '启用 0-禁用 1-启用', default: 1 })
  enable: number;
}
