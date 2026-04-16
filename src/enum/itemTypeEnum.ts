/** 项目类型 */
export enum ItemTypeEnum {
  /** 物业费类 */
  PropertyFee = 0,
  /** 公摊类 */
  SharedExpense = 1,
  /** 服务类 */
  Service = 2,
  /** 其他类 */
  Other = 3,
}

/** 项目类型标签 */
export enum ItemTypeLabelEnum {
  PropertyFee = '物业费类',
  SharedExpense = '公摊类',
  Service = '服务类',
  Other = '其他类',
}

/** 项目类型映射 */
export const ItemTypeValueEnum: Record<ItemTypeEnum, string> = {
  [ItemTypeEnum.PropertyFee]: ItemTypeLabelEnum.PropertyFee,
  [ItemTypeEnum.SharedExpense]: ItemTypeLabelEnum.SharedExpense,
  [ItemTypeEnum.Service]: ItemTypeLabelEnum.Service,
  [ItemTypeEnum.Other]: ItemTypeLabelEnum.Other,
}
