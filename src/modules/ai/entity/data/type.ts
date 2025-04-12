import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * AI 数据类型
 */
@Entity('ai_data_type')
export class AiDataTypeEntity extends BaseEntity {
  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '图标' })
  icon: string;

  @Column({ comment: '描述' })
  description: string;

  @Column({ comment: '类型 0-普通 1-文件', default: 0 })
  type: number;
}
