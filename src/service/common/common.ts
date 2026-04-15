import { http } from '@/utils/http'
import { IGetBannerListReq, IGetBannerListRes, IVersionItem } from '@/service/typings/common'

/**
 * 获取Banner列表
 * @returns
 */
export const getBannerListApi = (data: IGetBannerListReq) => {
  return http.get<IGetBannerListRes>('/WxMinApi/Banner/GetList', data, {
    errorMsg: '获取Banner列表失败',
  })
}

/**
 * 字典项
 */
export interface IDictItem {
  text: string
  val: number
  ext2: string
  enumValType: number
  displaySort: number
  id: number
}
/**
 * 字典数据类型
 */
export enum DictDataTypeEnum {
  /** 客户类型 */
  Type1 = 'type1',
  /** 采购单客户来源 */
  Type2 = 'type2',
  /** 客户状态 */
  Type3 = 'type3',
  /** 采购单类型 */
  Type4 = 'type4',
  /** 车身颜色 */
  Type5 = 'type5',
  /** 使用性质 */
  Type6 = 'type6',
  /** 所有权归属 */
  Type7 = 'type7',
  /** 内饰颜色 */
  Type8 = 'type8',
  /** 车况概述 */
  Type9 = 'type9',
  /** 车身结构 */
  Type10 = 'type10',
  /** 排放标准 */
  Type11 = 'type11',
  /** 能源类型 */
  Type12 = 'type12',
  /** 座位数 */
  Type13 = 'type13',
  /** 车体形式 */
  Type14 = 'type14',
  /** 变速箱类型 */
  Type15 = 'type15',
  /** 排量 */
  Type16 = 'type16',
  /** 客户管理-客户来源 */
  Type17 = 'type17',
  /** 关注点 */
  Type18 = 'type18',
  /** 预计买车时间 */
  Type19 = 'type19',
  /** 沟通方式 */
  Type20 = 'type20',
  /** 无效原因 */
  Type21 = 'type21',
  /** 战败原因 */
  Type22 = 'type22',
  /** 订单取消原因 */
  Type23 = 'type23',
  /** 婚姻状况 */
  Type24 = 'type24',
  /** 会员级别 */
  Type25 = 'type25',
}

/**
 * 字典数据
 */
export interface IDictDataRes {
  /** 客户类型 */
  type1: IDictItem[]
  /** 采购单客户来源 */
  type2: IDictItem[]
  /** 客户状态 */
  type3: IDictItem[]
  /** 采购单类型 */
  type4: IDictItem[]
  /** 车身颜色 */
  type5: IDictItem[]
  /** 使用性质 */
  type6: IDictItem[]
  /** 所有权归属 */
  type7: IDictItem[]
  /** 内饰颜色 */
  type8: IDictItem[]
  /** 车况概述 */
  type9: IDictItem[]
  /** 车身结构 */
  type10: IDictItem[]
  /** 排放标准 */
  type11: IDictItem[]
  /** 能源类型 */
  type12: IDictItem[]
  /** 座位数 */
  type13: IDictItem[]
  /** 车体形式 */
  type14: IDictItem[]
  /** 变速箱类型 */
  type15: IDictItem[]
  /** 排量 */
  type16: IDictItem[]
  /** 客户管理-客户来源 */
  type17: IDictItem[]
  /** 关注点 */
  type18: IDictItem[]
  /** 预计买车时间 */
  type19: IDictItem[]
  /** 沟通方式 */
  type20: IDictItem[]
  /** 无效原因 */
  type21: IDictItem[]
  /** 战败原因 */
  type22: IDictItem[]
  /** 订单取消原因 */
  type23: IDictItem[]
  /** 婚姻状况 */
  type24: IDictItem[]
  /** 会员级别 */
  type25: IDictItem[]
}

/**
 * 获取字典数据
 * @returns
 */
export const getDictDataApi = () => {
  return http.get<IDictDataRes>(
    '/WebApi/Common/GetDictData',
    {},
    {
      hideErrorToast: true,
      errorMsg: '获取字典数据失败',
    },
  )
}

/**
 * 获取车辆品牌
 * @returns
 */
export const getCarBrandApi = () => {
  return http.get<any>(
    '/WebApi/Brand/GetBrandTree',
    {},
    {
      hideErrorToast: true,
      errorMsg: '获取车辆品牌失败',
    },
  )
}

/**
 * 获取用户权限
 * @returns
 */
export const getUserPermissionsApi = () => {
  return http.get<any>(
    '/WebApi/Common/GetUserPermissions',
    {},
    {
      hideErrorToast: true,
    },
  )
}

/**
 * 更新App
 * @returns
 */
export const getLastAppVersionApi = () => {
  return http.get<IVersionItem>(
    '/WebApi/AppVersion/GetLastAppVersionItem',
    {},
    {
      hideErrorToast: true,
      errorMsg: '更新App失败',
    },
  )
}
