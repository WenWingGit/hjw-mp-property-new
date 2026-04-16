/** 适用范围 */
export enum ScopeEnum {
  /** 房产 */
  Estate = 0,
  /** 车位 */
  Parking = 1,
}

/** 适用范围标签 */
export enum ScopeLabelEnum {
  Estate = '房产',
  Parking = '车位',
}

/** 适用范围映射 */
export const ScopeValueEnum: Record<ScopeEnum, string> = {
  [ScopeEnum.Estate]: ScopeLabelEnum.Estate,
  [ScopeEnum.Parking]: ScopeLabelEnum.Parking,
}
