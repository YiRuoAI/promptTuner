import { Global, Module } from '@nestjs/common';

import { PromptTemplateController } from './controller';
import { PromptTemplateService } from './service';

@Global()
@Module({
  controllers: [PromptTemplateController],
  providers: [PromptTemplateService],
  exports: [PromptTemplateService],
})
export class PromptTemplateModule {}
