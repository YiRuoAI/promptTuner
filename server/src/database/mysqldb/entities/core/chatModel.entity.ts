import { BaseEntity } from '../base/base.entity';
// import { ChatModelType } from '@hook/useChatModel/type';
import { Column, Entity } from 'typeorm';

export enum ChatModelStatus {
  normal = 1, // 正常
  disabled = 2, // 禁用
}

@Entity('chat_models')
export class ChatModelEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '模型名称' })
  name: string;

  @Column({ type: 'varchar', length: 255, comment: '模型简介', default: '' })
  brief: string;

  @Column({ type: 'varchar', length: 255, comment: '服务商', default: '' })
  provider: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: '访问方式',
  })
  endpoints: any;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '模型的类型',
  })
  type: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: '模型的默认配置',
  })
  config: any;
}
