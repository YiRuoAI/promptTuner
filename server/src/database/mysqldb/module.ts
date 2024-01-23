import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { entities } from './entities';

const list: DynamicModule[] = [
  TypeOrmModule.forFeature(Object.values(entities)),
];

@Global()
@Module({
  imports: list,
  exports: list,
})
export class MySQLEntitiesModule {}
