import { EnvConfig } from '@common/env.config';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { entities } from './entities';
import { MySQLEntitiesModule } from './module';
import { SnakeNamingStrategy } from './strategy/snake-naming.strategy';

export const mysqldb: Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: EnvConfig.MYSQL_HOST,
    port: 3306,
    username: EnvConfig.MYSQL_USERNAME,
    password: EnvConfig.MYSQL_PASSWORD,
    database: EnvConfig.MYSQL_DATABASE,
    entities: Object.values(entities),
    namingStrategy: new SnakeNamingStrategy(),
    charset: 'utf8mb4',
    synchronize: false,
    migrationsRun: true,
    migrations: ['dist/database/mysqldb/migrations/*.js'],
  }),
  MySQLEntitiesModule,
];
