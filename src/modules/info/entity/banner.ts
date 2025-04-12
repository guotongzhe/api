import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 轮播图
 */
@Entity('info_banner')
export class InfoBannerEntity extends BaseEntity {
  @Index()
  @Column({ comment: '描述', nullable: true  })
  description: string;

  @Column({ comment: '图片' })
  pic: string;

  @Column({ comment: '跳转路径', nullable: true })
  path: string;

  @Column({ comment: '排序', nullable: true  })
  sortNum: number;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}
