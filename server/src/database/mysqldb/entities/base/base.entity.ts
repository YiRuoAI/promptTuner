import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BigIntTransformer } from '../transformers/bigInt.transformer';
import { DateTransformer } from '../transformers/date.transformer';

export class BaseEntity {
  @PrimaryColumn({ type: 'bigint', transformer: new BigIntTransformer() })
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn({
    type: 'datetime',
    transformer: new DateTransformer(),
    nullable: false,
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    transformer: new DateTransformer(),
    nullable: false,
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    nullable: true,
    default: null,
    precision: null,
    transformer: new DateTransformer(),
  })
  deletedAt = null;
}
