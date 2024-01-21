import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

export type DayjsParam = dayjs.Dayjs | string | number | CustomDayjs | Date;

export interface DayjsExtends {
  isSameOrBefore: (date?: DayjsParam, unit?: dayjs.OpUnitType) => boolean;
  isSameOrAfter: (date?: DayjsParam, unit?: dayjs.OpUnitType) => boolean;
  isBetween: (start: DayjsParam, end: DayjsParam) => boolean;
}

export type CustomDayjs = dayjs.Dayjs & DayjsExtends;

/**
 * 判断当前日期是否小于等于传入的日期
 */
dayjs.prototype.isSameOrBefore = function (
  date?: DayjsParam,
  unit?: dayjs.OpUnitType,
) {
  return this.isSame(date, unit) || this.isBefore(date, unit);
};
/**
 * 判断当前日期是否大于等于传入的日期
 */
dayjs.prototype.isSameOrAfter = function (
  date?: DayjsParam,
  unit?: dayjs.OpUnitType,
) {
  return this.isSame(date, unit) || this.isAfter(date, unit);
};

dayjs.prototype.isBetween = function (start: DayjsParam, end: DayjsParam) {
  return this.isAfter(start) && this.isBefore(end);
};

export function useDayjs(
  date?: dayjs.ConfigType,
  option?: dayjs.OptionType,
  locale?: string,
) {
  return {
    dayjs: dayjs as unknown as (
      date?: dayjs.ConfigType,
      option?: dayjs.OptionType,
      locale?: string,
    ) => CustomDayjs,
    current: dayjs(date, option, locale) as unknown as CustomDayjs,
  };
}
