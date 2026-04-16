/** 账单支付状态 */
export enum BillPayStatusEnum {
  /** 待缴费 */
  Pending = 0,
  /** 缴费中 */
  Paying = 1,
  /** 已缴费 */
  Paid = 2,
  /** 已取消 */
  Cancelled = 3,
  /** 已补打 */
  Reprinted = 4,
  /** 已核销 */
  Verified = 5,
  /** 变更中 */
  Changing = 6,
}

/** 账单支付状态标签 */
export enum BillPayStatusLabelEnum {
  Pending = '待缴费',
  Paying = '缴费中',
  Paid = '已缴费',
  Cancelled = '已取消',
  Reprinted = '已补打',
  Verified = '已核销',
  Changing = '变更中',
}

/** 账单支付状态值映射 */
export const BillPayStatusValueEnum: Record<BillPayStatusEnum, string> = {
  [BillPayStatusEnum.Pending]: BillPayStatusLabelEnum.Pending,
  [BillPayStatusEnum.Paying]: BillPayStatusLabelEnum.Paying,
  [BillPayStatusEnum.Paid]: BillPayStatusLabelEnum.Paid,
  [BillPayStatusEnum.Cancelled]: BillPayStatusLabelEnum.Cancelled,
  [BillPayStatusEnum.Reprinted]: BillPayStatusLabelEnum.Reprinted,
  [BillPayStatusEnum.Verified]: BillPayStatusLabelEnum.Verified,
  [BillPayStatusEnum.Changing]: BillPayStatusLabelEnum.Changing,
}
