import { Global, Module } from '@nestjs/common';

import { TestController } from './controller';
import { TestService } from './service';

@Global()
@Module({
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
