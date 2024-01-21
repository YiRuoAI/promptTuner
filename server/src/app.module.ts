import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfig } from '@config/env.config';
import { GlobalModule } from '@globalModules/global.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelModule } from '@modules/model/model.module';
import { SnakeNamingStrategy } from '@strategy/snake-naming.strategy';
import { PromptTemplateModule } from '@modules/promptTemplate/promptTemplate.module';
import { TestModule } from '@modules/test/test.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WrapResponseInterceptor } from '@interceptors/wrapResponse.interceptor';
import { CustomExceptionFilter } from '@filters/customException.filter';

const importsArr = [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: EnvConfig.MYSQL_HOST,
    port: 3306,
    username: EnvConfig.MYSQL_USERNAME,
    password: EnvConfig.MYSQL_PASSWORD,
    database: EnvConfig.MYSQL_DATABASE,
    entities: ['dist/**/*.entity{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
  }),
  GlobalModule,
  ModelModule,
  PromptTemplateModule,
  TestModule,
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
