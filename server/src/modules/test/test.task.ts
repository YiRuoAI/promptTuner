import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { TestService } from './service';

@Injectable()
export class TestTask {
  constructor(private readonly testService: TestService) {}

  @Cron('*/30 * * * * *')
  async scanJob() {
    try {
      this.testService.scanJob();
    } catch (err) {
      console.error('处理任务失败', err);
    }
  }

  @Cron('0 * * * * *')
  async checkJob() {
    try {
      this.testService.checkJob();
    } catch (err) {
      console.error('检查任务失败失败', err);
    }
  }
}
