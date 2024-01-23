import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

import { mysqldb } from './mysqldb';

export const database: Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [...mysqldb];
