import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户设备
 */
@Entity('msg_device')
export class MsgDeviceEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: 'CID', nullable: true })
  cid: string;

  @Column({ comment: '别名', nullable: true })
  alias: string;

  @Column({ comment: '标签', type: 'json', nullable: true })
  tags: string[];

  @Column({
    comment: '类型 0-未知 1-H5 2-APP 3-小程序 ',
    nullable: true,
  })
  type: number;
}
