/** 店铺上架状态 */
export enum ShopOnlineIntEnum {
  /** 全部 */
  All = 0,
  /** 上架 */
  Online = 1,
  /** 下架 */
  Offline = 2,
}

/** 店铺上架状态标签 */
export enum ShopOnlineIntLabelEnum {
  All = '全部',
  Online = '上架',
  Offline = '下架',
}

/** 店铺上架状态映射 */
export const ShopOnlineIntValueEnum: Record<ShopOnlineIntEnum, string> = {
  [ShopOnlineIntEnum.All]: ShopOnlineIntLabelEnum.All,
  [ShopOnlineIntEnum.Online]: ShopOnlineIntLabelEnum.Online,
  [ShopOnlineIntEnum.Offline]: ShopOnlineIntLabelEnum.Offline,
}
