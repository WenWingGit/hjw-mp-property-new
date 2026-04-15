import { AccountTypeEnum } from '@/enum/accountTypeEnum'
import { IdNumber } from '@/typings'

// 登录请求
export interface ILoginByWxPhoneCodeReq {
  phoneCode: string
  wxCode: string
  encryptedData: string
  iv: string
  salesUserId: number
}

// 登录请求
export interface ILoginAccountReq {
  phone?: string
  verificationCode: string
  wxCode?: string
  salesUserId?: number
}

/** 登录响应 */
export interface ILoginRes {
  accessToken: string
  refreshToken: string
  /** AccessToken的失效日期，用于前端判断是否需要传刷新token */
  expireTime: string
  /** 刷新令牌过期天数 */
  refreshExpireDay: number
  /** AccessToken的失效分钟数 */
  expireTimeMinute: number
  /** 门店Id */
  createdStoreId: IdNumber
  /** 实际所属门店Id */
  affiliatedStoreId: IdNumber
  /** 用户Id */
  userId: IdNumber
  /** 账号类型 */
  accountType: AccountTypeEnum
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
  accountType: AccountTypeEnum
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
