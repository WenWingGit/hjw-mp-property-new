/** 收费类型 */
export enum ChargeTypeEnum {
  /** 按建筑面积 */
  ByBuildingArea = 0,
  /** 按使用面积 */
  ByUsableArea = 1,
  /** 固定金额 */
  FixedAmount = 2,
}

/** 收费类型标签 */
export enum ChargeTypeLabelEnum {
  ByBuildingArea = '按建筑面积',
  ByUsableArea = '按使用面积',
  FixedAmount = '固定金额',
}

/** 收费类型映射 */
export const ChargeTypeValueEnum: Record<ChargeTypeEnum, string> = {
  [ChargeTypeEnum.ByBuildingArea]: ChargeTypeLabelEnum.ByBuildingArea,
  [ChargeTypeEnum.ByUsableArea]: ChargeTypeLabelEnum.ByUsableArea,
  [ChargeTypeEnum.FixedAmount]: ChargeTypeLabelEnum.FixedAmount,
}
