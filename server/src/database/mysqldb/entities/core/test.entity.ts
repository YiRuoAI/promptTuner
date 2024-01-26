import { BaseEntity } from '../base/base.entity';
import { Column, Entity } from 'typeorm';

export class ModelConfigItem {
  name: string;
  modelId: string;
  conversationConfig: ConversationConfigItem[];
}

export enum ConversationType {
  // 使用prompt template
  promptTemplate,
  // 自定义
  custom,
}

export class InputConfigItem {
  input: string;
}

export class ConversationConfigItem {
  type: ConversationType;
  promptTemplateId?: string;
  prompt?: string;
}

@Entity('tests')
export class TestEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '模型名称' })
  name: string;

  @Column({ type: 'varchar', length: 255, comment: '模型简介', default: '' })
  brief: string;

  @Column({ type: 'json', comment: '模型配置', nullable: true })
  modelConfig: ModelConfigItem[];

  @Column({ type: 'json', comment: '输入配置', nullable: true })
  inputConfig: InputConfigItem[];
}
