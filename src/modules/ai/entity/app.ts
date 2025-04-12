import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 应用
 */
@Entity('ai_app')
export class AiAppEntity extends BaseEntity {
  @Column({ comment: 'LOGO' })
  logo: string;

  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '信息库', nullable: true })
  dataId: number;

  @Column({ comment: 'Ai预设', type: 'text' })
  prompt: string;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;

  @Column({ comment: '关联上下文 0-否 1-是', default: 1 })
  isContext: number;
}
