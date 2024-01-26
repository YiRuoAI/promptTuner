import { BaseEntity } from '../base/base.entity';
import { Column, Entity } from 'typeorm';
import { InputConfigItem, ModelConfigItem } from './test.entity';

// 定义测试任务的状态
export enum TestJobStatus {
  // 未开始
  notStarted = 0,
  // 进行中
  processing = 1,
  // 已完成
  finished = 2,
  // 已取消
  canceled = 3,
}

@Entity('test_jobs')
export class TestJobEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '测试编号' })
  testId: string;

  @Column({ type: 'json', comment: '模型配置', nullable: true })
  modelConfig: ModelConfigItem[];

  @Column({ type: 'json', comment: '输入配置', nullable: true })
  inputConfig: InputConfigItem[];

  @Column({ type: 'json', comment: '模型快照', nullable: true })
  modelSnapshot: any;

  // 存放执行结果的状态 tinyint
  @Column({ type: 'tinyint', comment: '执行状态', default: 0 })
  status: TestJobStatus;
}
