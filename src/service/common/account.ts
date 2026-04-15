import { PayAccountTypeEnum } from '@/enum/payAccountType'
import { PayAccountUseScopeEnum } from '@/enum/payAccountUseScope'
import { IdNumber } from '@/typings'
import { http } from '@/utils/http'

/**
 * 账号列表
 * @param params
 * @returns
 */
export const getAccountListApi = (params: any) => {
  return http.get('/WebApi/PayAccount/GetList', params, {
    errorMsg: '获取账号列表失败',
  })
}

interface ICreateAccountReq {
  id: number
  ownerSysUserId: number
  accountPayType: number
  account: string
  bankCard: string
  bank: string
  isDefault: boolean
  payAccountType: PayAccountTypeEnum
  payAccountUseScope: PayAccountUseScopeEnum
}

/**
 * 创建账号
 * @param params
 * @returns
 */
export const createAccountApi = (params: ICreateAccountReq) => {
  return http.post('/WebApi/PayAccount/Create', params, {
    errorMsg: '创建账号失败',
  })
}

/**
 * 编辑账号
 * @param params
 * @returns
 */
export const editAccountApi = (params: any) => {
  return http.post('/WebApi/PayAccount/Edit', params, {
    errorMsg: '编辑账号失败',
  })
}

/**
 * 删除账号
 * @param params
 * @returns
 */
export const deleteAccountApi = (ids: any) => {
  return http.post(
    '/WebApi/PayAccount/Delete',
    { ids },
    {
      errorMsg: '删除账号失败',
    },
  )
}

/**
 * 获取账号详情
 * @param id
 * @returns
 */
export const getAccountDetailApi = (id: number) => {
  return http.get(`/WebApi/PayAccount/GetDtoById`, { id }, { errorMsg: '获取账号详情失败' })
}

/**
 * 修改密码
 * @param params
 * @returns
 */
export const changePasswordApi = (params: {
  id: IdNumber
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}) => {
  return http.post('/WebApi/AppUser/ChangePassword', params, {
    errorMsg: '修改密码失败',
  })
}
