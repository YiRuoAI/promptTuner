import { Global, Module } from '@nestjs/common';

import { MySQLEntitiesModule } from './sql/mysql-entities.module';

@Global()
@Module({
  imports: [MySQLEntitiesModule],
})
export class GlobalModule {}
