import { useDayjs } from '@hook/useDayjs';
import { ValueTransformer } from 'typeorm';

const { dayjs } = useDayjs();

export class DateTransformer implements ValueTransformer {
  to(data: string | Date): Date {
    // 写操作
    return data ? dayjs(data).toDate() : undefined;
  }
  from(data: string | Date): string {
    // 因为空字符串会被识别为当前时间
    // 读操作
    return dayjs(data || '-').isValid()
      ? dayjs(data).format('YYYY-MM-DD HH:mm:ss')
      : undefined;
  }
}
