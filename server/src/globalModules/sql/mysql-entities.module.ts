import { ChatModelEntity } from '@entities/chatModel.entity';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const list: DynamicModule[] = [TypeOrmModule.forFeature([ChatModelEntity])];

@Global()
@Module({
  imports: list,
  exports: list,
})
export class MySQLEntitiesModule {}
