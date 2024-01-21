import { Global, Module } from '@nestjs/common';

import { ModelController } from './model.controller';
import { ModelService } from './model.service';

@Global()
@Module({
  controllers: [ModelController],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
