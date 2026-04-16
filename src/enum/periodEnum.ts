/** 周期类型 */
export enum PeriodEnum {
  /** 按天 */
  ByDay = 0,
  /** 按月 */
  ByMonth = 1,
  /** 按年 */
  ByYear = 2,
}

/** 周期类型标签 */
export enum PeriodLabelEnum {
  ByDay = '按天',
  ByMonth = '按月',
  ByYear = '按年',
}

/** 周期类型映射 */
export const PeriodValueEnum: Record<PeriodEnum, string> = {
  [PeriodEnum.ByDay]: PeriodLabelEnum.ByDay,
  [PeriodEnum.ByMonth]: PeriodLabelEnum.ByMonth,
  [PeriodEnum.ByYear]: PeriodLabelEnum.ByYear,
}
