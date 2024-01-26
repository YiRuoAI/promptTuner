import { Global, Module } from '@nestjs/common';

import { TestController } from './controller';
import { TestService } from './service';
import { TestTask } from './test.task';
import { TestResultService } from './testResult.service';

@Global()
@Module({
  controllers: [TestController],
  providers: [TestService, TestTask, TestResultService],
  exports: [TestService, TestResultService],
})
export class TestModule { }
