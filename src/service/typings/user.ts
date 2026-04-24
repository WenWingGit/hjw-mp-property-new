import { IdNumber } from '@/typings'

// 登录请求
export interface ILoginByWxPhoneCodeReq {
  phoneCode?: string
  // wxCode: string
  // encryptedData: string
  // iv: string
  // salesUserId: number
  clientId: string
  grantType: string
  code: string
}

// 登录请求
export interface ILoginAccountReq {
  username: string
  password: string
  clientId: string
  grantType: string
  iv: string
  requestId: string
}

/** 登录响应 */
export interface ILoginRes {
  accessToken: string
  refreshToken?: string
  expireIn: number
  userInfo: IUserInfo
}

/** 用户信息响应 */
export interface IUserInfo {
  email: string
  id: number
  logo: string
  nickname: string
  phone: string
  username: string
}

/** 修改密码请求 */
export interface IChangePwdReq {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

/** 获取验证码请求 */
export interface IGetCaptchaReq {
  phone: string
  wxCode?: string
}

export interface ILoginByWxCodeReq {
  wxCode: string
  salesUserId?: number
}

/** 获取用户信息响应 */
export interface IGetUserInfoRes {
  id: number
  avatar: string
  name: string
  phone: string
  createdTime: string
  customerId: number
}

/** 编辑用户信息请求 */
export interface IEditUserInfoReq {
  avatar: string | null
  name: string
}

/** 修改个人资料 */
export interface IUpdateUserInfoReq {
  name: string
  avatar: string
}
