/** 支付用途 */
export enum PaymentPurposeEnum {
  /** 预存 */
  Deposit = 0,
  /** 缴费 */
  Payment = 1,
}

/** 支付用途标签 */
export enum PaymentPurposeLabelEnum {
  Deposit = '预存',
  Payment = '缴费',
}

/** 支付用途映射 */
export const PaymentPurposeValueEnum: Record<PaymentPurposeEnum, string> = {
  [PaymentPurposeEnum.Deposit]: PaymentPurposeLabelEnum.Deposit,
  [PaymentPurposeEnum.Payment]: PaymentPurposeLabelEnum.Payment,
}
