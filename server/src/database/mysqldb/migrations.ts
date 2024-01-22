import { DataSource } from 'typeorm';

import { EnvConfig } from '../../common/env.config';
import { entities } from './entities';
import { SnakeNamingStrategy } from './strategy/snake-naming.strategy';

export default new DataSource({
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
  migrations: EnvConfig.isProd
    ? ['dist/database/mysqldb/migrations/*.js']
    : ['src/database/mysqldb/migrations/*.ts'],
});
