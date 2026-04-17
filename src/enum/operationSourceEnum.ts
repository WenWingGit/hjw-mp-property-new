/** 操作来源 */
export enum OperationSourceEnum {
  /** 业主 */
  Owner = 0,
  /** 工作人员 */
  Staff = 1,
  /** 系统 */
  System = 2,
}

/** 操作来源标签 */
export enum OperationSourceLabelEnum {
  Owner = '业主',
  Staff = '工作人员',
  System = '系统',
}

/** 操作来源映射 */
export const OperationSourceValueEnum: Record<OperationSourceEnum, string> = {
  [OperationSourceEnum.Owner]: OperationSourceLabelEnum.Owner,
  [OperationSourceEnum.Staff]: OperationSourceLabelEnum.Staff,
  [OperationSourceEnum.System]: OperationSourceLabelEnum.System,
}
