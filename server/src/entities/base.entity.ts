import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BigIntTransformer } from './transformers/bigInt.transformer';

export class BaseEntity {
  @PrimaryColumn({ type: 'bigint', transformer: new BigIntTransformer() })
  id: string;

  @CreateDateColumn({
    type: Number,
    default: () => 1,
  })
  createdAt: number;

  @UpdateDateColumn({
    type: Number,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: number;

  @DeleteDateColumn({
    type: Number,
    nullable: true,
    default: 0,
  })
  deletedAt = null;
}
