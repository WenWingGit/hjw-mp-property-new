import { http } from '@/utils/http'
import {
  ILoginByWxPhoneCodeReq,
  IGetUserInfoRes,
  ILoginAccountReq,
  ILoginRes,
  IGetCaptchaReq,
  ILoginByWxCodeReq,
  IUpdateUserInfoReq,
} from './typings/user'

// 登录用wxPhoneCode
export const loginByWxPhoneCodeApi = (params: ILoginByWxPhoneCodeReq) => {
  return http.post<ILoginRes>('/WxMinApi/Auth/LoginByPhoneCode', params)
}

// 登录用wxcode
export const loginByWxCodeApi = (params: ILoginByWxCodeReq) => {
  return http.post<ILoginRes>('/WxMinApi/Auth/LoginByWxCode', params)
}

// 登录
export const doStoreLoginApi = (params: ILoginAccountReq) => {
  return http.post<ILoginRes>('/api/admin/auth/login', params)
}

// 获取用户信息
export const getUserInfoApi = () => {
  return http.get<IGetUserInfoRes>('/WxMinApi/WxMinUser/GetUserInfo')
}

// 更新用户信息
export const updateUserInfoApi = (params: IUpdateUserInfoReq) => {
  return http.post<IGetUserInfoRes>('/WxMinApi/WxMinUser/EditUserInfo', params)
}

// 获取验证码
export const getCaptchaApi = (params: IGetCaptchaReq) => {
  return http.post('/WxMinApi/Auth/SendVerificationCode', params)
}

// 绑定销售
export const bindSalesUserApi = (salesUserId: number) => {
  return http.post('/WxMinApi/Auth/BindSalesUser', { salesUserId })
}

export const getHouseWalletBalanceApi = () => {
  return ''
}