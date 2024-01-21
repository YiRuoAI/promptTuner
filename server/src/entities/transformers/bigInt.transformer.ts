import { ValueTransformer } from 'typeorm';

export class BigIntTransformer implements ValueTransformer {
  to(value: string | null) {
    return value;
  }

  from(value: number | null) {
    return String(value || '');
  }
}
