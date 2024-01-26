import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelModule } from '@modules/model/model.module';
import { PromptTemplateModule } from '@modules/promptTemplate/promptTemplate.module';
import { TestModule } from '@modules/test/test.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WrapResponseInterceptor } from '@interceptors/wrapResponse.interceptor';
import { CustomExceptionFilter } from '@filters/customException.filter';
import { database } from './database';
import { ScheduleModule } from '@nestjs/schedule';

const importsArr = [
  ...database,
  ModelModule,
  PromptTemplateModule,
  TestModule,
  ScheduleModule.forRoot(),
];

@Module({
  imports: importsArr,
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
