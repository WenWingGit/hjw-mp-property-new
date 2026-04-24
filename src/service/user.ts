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
  return http.post<ILoginRes>('/api/admin/wechat/mini/user/login', params)
}

// 登录
export const doStoreLoginApi = (params: ILoginByWxPhoneCodeReq) => {
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
