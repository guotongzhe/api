import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 资讯-新闻
 */
@Entity('info_news')
export class InfoNewsEntity extends BaseEntity {
  @Index()
  @Column({ comment: '标题' })
  title: string;

  @Column({ comment: '简介' })
  description: string;

  @Column({ comment: '图片', type: 'json', nullable: true })
  pics: string[];

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '预览', default: 0 })
  view: number;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}
