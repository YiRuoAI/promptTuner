import { BaseEntity } from '../base/base.entity';
import { Column, Entity } from 'typeorm';

// 定义测试任务的状态
export enum TestJobItemStatus {
  // 未开始
  notStarted = 0,
  // 进行中
  processing = 1,
  // 已完成
  finished = 2,
  // 已取消
  canceled = 3,
}

@Entity('test_job_items')
export class TestJobItemEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '测试编号' })
  testId: string;

  @Column({ type: 'varchar', length: 255, comment: '测试任务编号' })
  testJobId: string;

  @Column({ type: 'json', comment: '模型快照', nullable: true })
  modelSnapshot: any;

  @Column({ type: 'json', comment: 'prompt数组', nullable: true })
  prompts: any;

  @Column({ type: 'json', comment: '结果', nullable: true })
  messages: any;

  // 调用的结果
  @Column({ type: 'json', comment: '调用结果', nullable: true })
  result: any;

  // 状态
  @Column({ type: 'tinyint', comment: '执行状态', default: 0 })
  status: TestJobItemStatus;
}
