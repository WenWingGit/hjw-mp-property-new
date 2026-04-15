/* eslint-disable no-param-reassign */
import qs from 'qs'
import { useLoginStore } from '@/store'
import PLATFORM, { platform, isWxMiniProgram } from '@/utils/platform'
import { type IUniUploadFileOptions } from '@/typings'
import { type ILoginRes } from '@/service/typings/user'
import { getAccessToken, getRefreshToken } from '@/utils/login'
import { checkLogin } from '@/utils/common'
import { onWxLogin } from '@/utils/login'

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
  errorMsg?: string
  /** 重试次数（内部使用，防止无限重试） */
  _retryCount?: number
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 请求基准地址
const baseUrl = import.meta.env.VITE_SERVER_BASEURL

// 自动登录标志，确保只执行一次
let autoLoginTriggered = false

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 如果是微信小程序且未登录，且是第一个请求，尝试自动登录（静默，不阻塞）
    // 这样可以处理旧用户（已注册但token过期）通过分享链接进入的情况
    if (
      !autoLoginTriggered &&
      isWxMiniProgram &&
      !checkLogin() &&
      !options.url.includes('/WxMinApi/Auth/LoginByWxCode') &&
      !options.url.includes('/WxMinApi/Auth/LoginByPhoneAndVerificationCode') &&
      !options.url.includes('/WxMinApi/Auth/SendVerificationCode')
    ) {
      autoLoginTriggered = true
      // 静默登录，不等待结果，不阻塞请求
      onWxLogin().catch(() => {
        // 登录失败静默处理，可能是新用户
      })
    }
    // 接口请求支持通过 query 参数配置 queryString
    if (options.query) {
      const queryStr = qs.stringify(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      } else {
        options.url += `?${queryStr}`
      }
    }
    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      // #ifdef H5
      // console.log(__VITE_APP_PROXY__)
      if (JSON.parse(__VITE_APP_PROXY__)) {
        // 啥都不需要做
      } else {
        options.url = baseUrl + options.url
      }
      // #endif
      // 非H5正常拼接
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }
    // 1. 请求超时
    options.timeout = 10000 // 10s
    // 2. （可选）添加小程序端请求头标识
    const headers = getHeaders()
    // debugger
    options.header = {
      platform, // 可选，与 uniapp 定义的平台一致，告诉后台来源
      ...(options?.headers || {}),
      ...(headers || {}),
    }
    console.log({ options })
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}

export function getHeaders() {
  const header = {
    // 'content-type': 'application/json', // 默认值
    Authorization: '',
  }
  const loginStore = useLoginStore()

  const { expireTime } =
    loginStore.loginInfo ||
    ({
      accessToken: '',
      refreshToken: '',
      expireTime: '',
    } as unknown as ILoginRes)

  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()

  header['Authorization'] = 'Bearer ' + accessToken

  let isSendRefreshToken = true
  if (expireTime) {
    isSendRefreshToken = new Date(expireTime.split('-').join('/')) < new Date()
  }
  if (isSendRefreshToken && refreshToken !== '') {
    header['X-Authorization'] = 'Bearer ' + refreshToken
  }

  header['App-Version'] =
    `${PLATFORM.isApp ? 'APP_' : PLATFORM.platform}${import.meta.env.VITE_APP_VERSION}`

  console.log({ header })
  return header
}

/**
 * 实现异步延迟
 * @param delay 延迟时间（毫秒）
 * @returns
 */
export function sleep(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}
