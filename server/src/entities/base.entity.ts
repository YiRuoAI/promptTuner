import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BigIntTransformer } from './transformers/bigInt.transformer';
import { DateTransformer } from './transformers/date.transformer';

export class BaseEntity {
  @PrimaryColumn({ type: 'bigint', transformer: new BigIntTransformer() })
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new DateTransformer(),
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: new DateTransformer(),
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: Number,
    nullable: true,
    default: 0,
  })
  deletedAt = null;
}
