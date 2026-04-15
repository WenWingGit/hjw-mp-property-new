import { http } from '@/utils/http'

/**
 * 省数据
 */
export interface IProvinceItem {
  id: number
  name: string
  code: string
  parentCode: string
  level: number
  pathCode: string
  createdTime: string
}

/**
 * 获取省数据
 * @returns
 */
export const getProvinceApi = () => {
  return http.get<IProvinceItem[]>(
    '/WebApi/City/GetLevel1',
    {},
    {
      errorMsg: '获取省数据失败',
    },
  )
}

/**
 * 市数据
 */
export interface ICityItem extends IProvinceItem {}

/**
 * 获取市数据
 * @returns
 */
export const getCityApi = (parentCode: string) => {
  return http.get<ICityItem[]>(
    '/WebApi/City/GetByParentCode',
    {
      locationCityCode1: parentCode,
    },
    {
      errorMsg: '获取市数据失败',
    },
  )
}

/**
 * 获取区数据
 * @param parentCode 父级code
 * @returns
 */
export const getDistrictApi = (parentCode: string) => {
  return http.get<ICityItem[]>(
    '/WebApi/City/GetDistrictByParentCode',
    {
      parentCode,
    },
    {
      errorMsg: '获取区数据失败',
    },
  )
}
