import { CustomRequestOptions } from '@/interceptors/request'
import { IResData } from '@/typings'
import { getCache, removeCache } from './storage'
import { LoginCacheKey } from '@/store/storeName'
import { updateToken, onWxLogin, getAccessToken } from './login'
import PAGE_CACHE_KEY from '@/maps/chaheKeys'
import { PageKey } from '@/maps/pageKeys'
import { getNeedLoginPages, navToLogin } from '.'
import PLATFORM from '@/utils/platform'
import { getHeaders } from '@/interceptors/request'

// import { useLoginStore } from '@/store'
// const loginStore = useLoginStore()

/**
 * 判断是否为登录相关接口
 */
function isLoginApi(url: string): boolean {
  return (
    url.includes('/WxMinApi/Auth/LoginByWxCode') ||
    url.includes('/WxMinApi/Auth/LoginByPhoneAndVerificationCode') ||
    url.includes('/WxMinApi/Auth/SendVerificationCode')
  )
}

/**
 * 重试请求
 */
function retryRequest<T>(options: CustomRequestOptions): Promise<IResData<T>> {
  return new Promise<IResData<T>>((resolve, reject) => {
    // 更新header，使用最新的token
    const headers = getHeaders()
    const newOptions: CustomRequestOptions = {
      ...options,
      header: {
        ...options.header,
        ...headers,
      },
      // 标记已重试，防止无限重试
      _retryCount: (options._retryCount || 0) + 1,
    }

    uni.request({
      ...newOptions,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      success(res) {
        // 如果请求回来有刷新token，则更新token
        if (typeof res.header !== 'undefined') {
          const accessToken = res.header['access-token'] || ''
          const refreshAccessToken = res.header['x-access-token'] || ''
          if (accessToken !== '') {
            console.log({ accessToken, refreshAccessToken })
            updateToken(accessToken, refreshAccessToken)
          }
        }

        const data = res.data as IResData<T>
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (data?.code === 200) {
            resolve(data)
          } else {
            const msg = typeof data.message === 'string' ? data.message : options?.errorMsg
            !options.hideErrorToast && httpTips(msg || '请求错误')
            reject(res)
          }
        } else {
          const msg =
            typeof (res.data as IResData<T>).message === 'string'
              ? (res.data as IResData<T>).message
              : options?.errorMsg

          !options.hideErrorToast && httpTips(msg || '请求错误')
          reject(res)
        }
      },
      fail(err) {
        httpTips('网络错误，换个网络试试')
        reject(err)
      },
    })
  })
}

export const http = <T>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<IResData<T>>(async (resolve, reject) => {
    // 不强制登录，让用户先体验
    // 直接发送请求，如果接口支持未登录访问，会正常返回
    // 如果接口需要登录，会收到401，由下面的401处理逻辑处理

    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        // 如果请求回来有刷新token，则更新token
        if (typeof res.header !== 'undefined') {
          const accessToken = res.header['access-token'] || ''
          const refreshAccessToken = res.header['x-access-token'] || ''
          if (accessToken !== '') {
            console.log({ accessToken, refreshAccessToken })
            updateToken(accessToken, refreshAccessToken)
          }
        }

        const notNeedLogin = import.meta.env.VITE_NOT_NEED_LOGIN
        // 状态码 2xx，参考 axios 的设计
        // 2.1 提取核心数据 res.data
        const data = res.data as IResData<T>
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (data?.code === '0000') {
            resolve(data)
          } else if (data?.code === 401) {
            // 清除登录信息
            removeCache(LoginCacheKey)
            Object.values(PAGE_CACHE_KEY).forEach((key) => {
              uni.removeStorageSync(key)
            })

            // 判断平台，微信小程序自动登录重试，其他平台跳转登录页
            // if (PLATFORM.isWxMiniProgram && !isLoginApi(options.url)) {
            //   // 检查是否已重试过，防止无限重试
            //   const retryCount = options._retryCount || 0
            //   if (retryCount < 1) {
            //     // 自动登录并重试
            //     onWxLogin()
            //       .then((loginResult) => {
            //         if (loginResult) {
            //           // 登录成功，重试请求
            //           retryRequest<T>(options).then(resolve).catch(reject)
            //         } else {
            //           // 登录失败（可能是新用户），静默处理，不强制跳转登录页
            //           // 让用户继续体验，需要登录时再提示
            //           reject(res)
            //         }
            //       })
            //       .catch(() => {
            //         // 登录异常，静默处理
            //         reject(res)
            //       })
            //     return
            //   }
            // }

            // 其他平台或已重试过，静默处理（不强制跳转登录页，让用户继续体验）
            reject(res)
          } else {
            const msg = typeof data.message === 'string' ? data.message : options?.errorMsg
            // 显示请求错误提示
            !options.hideErrorToast && httpTips(msg || '请求错误')
            reject(res)
          }
        } else if (res.statusCode === 401) {
          // 401错误 -> 清理用户信息
          removeCache(LoginCacheKey)
          Object.values(PAGE_CACHE_KEY).forEach((key) => {
            uni.removeStorageSync(key)
          })

          // 判断平台，微信小程序自动登录重试，其他平台跳转登录页
          // if (PLATFORM.isWxMiniProgram && !isLoginApi(options.url)) {
          //   // 检查是否已重试过，防止无限重试
          //   const retryCount = options._retryCount || 0
          //   if (retryCount < 1) {
          //     // 自动登录并重试
          //     onWxLogin()
          //       .then((loginResult) => {
          //         if (loginResult) {
          //           // 登录成功，重试请求
          //           retryRequest<T>(options).then(resolve).catch(reject)
          //         } else {
          //           // 登录失败（可能是新用户），静默处理，不强制跳转登录页
          //           // 让用户继续体验，需要登录时再提示
          //           reject(res)
          //         }
          //       })
          //       .catch(() => {
          //         // 登录异常，静默处理
          //         reject(res)
          //       })
          //     return
          //   }
          // }

          // 其他平台或已重试过，静默处理（不强制跳转登录页，让用户继续体验）
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          if (data?.code === 401) {
            // 清除登录信息
            removeCache(LoginCacheKey)
            Object.values(PAGE_CACHE_KEY).forEach((key) => {
              uni.removeStorageSync(key)
            })

            // 判断平台，微信小程序自动登录重试，其他平台跳转登录页
            // if (PLATFORM.isWxMiniProgram && !isLoginApi(options.url)) {
            //   // 检查是否已重试过，防止无限重试
            //   const retryCount = options._retryCount || 0
            //   if (retryCount < 1) {
            //     // 自动登录并重试
            //     onWxLogin()
            //       .then((loginResult) => {
            //         if (loginResult) {
            //           // 登录成功，重试请求
            //           retryRequest<T>(options).then(resolve).catch(reject)
            //         } else {
            //           // 登录失败（可能是新用户），静默处理，不强制跳转登录页
            //           // 让用户继续体验，需要登录时再提示
            //           reject(res)
            //         }
            //       })
            //       .catch(() => {
            //         // 登录异常，静默处理
            //         reject(res)
            //       })
            //     return
            //   }
            // }

            // 其他平台或已重试过，静默处理（不强制跳转登录页，让用户继续体验）
            reject(res)
          } else {
            const msg =
              typeof (res.data as IResData<T>).message === 'string'
                ? (res.data as IResData<T>).message
                : options?.errorMsg

            !options.hideErrorToast && httpTips(msg || '请求错误')
            reject(res)
          }
        }
      },
      // 响应失败
      fail(err) {
        httpTips('网络错误，换个网络试试')
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param {object} opts 其他配置项
 * @returns
 */
export const httpGet = <T>(
  url: string,
  query?: Record<string, any>,
  opts?: {
    /** 是否隐藏错误提示 */
    hideErrorToast?: boolean
    /** 默认的错误提示文案，如果后端返回的错误信息为空，则显示这个文案 */
    errorMsg?: string
    /** 是否需要登录 */
    needLogin?: boolean
  },
) => {
  return http<T>({
    url,
    query,
    method: 'GET',
    ...opts,
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param {object} opts 其他配置项
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  opts?: {
    /** 是否隐藏错误提示 */
    hideErrorToast?: boolean
    /** 错误提示文案 */
    errorMsg?: string
    /** query参数 */
    query?: Record<string, any>
    /** 是否需要登录 */
    needLogin?: boolean
  },
) => {
  return http<T>({
    url,
    data,
    method: 'POST',
    ...opts,
  })
}

function httpTips(title: string): void {
  if (title === '请先授权登录') {
    return
  }
  uni.showToast({
    icon: 'none',
    title: title || '请求错误',
    mask: true,
  })
}

http.get = httpGet
http.post = httpPost
