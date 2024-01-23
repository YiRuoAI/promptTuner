import { BaseEntity } from '../base/base.entity';
// import { ChatModelType } from '@hook/useChatModel/type';
import { Column, Entity } from 'typeorm';

export enum ChatModelStatus {
  normal = 1, // 正常
  disabled = 2, // 禁用
}

@Entity('prompt_templates')
export class PromptTemplateEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '模板名称' })
  name: string;

  @Column({ type: 'text', comment: '模板' })
  prompt: string;
}
