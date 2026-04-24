/* eslint-disable */
import dayjs from 'dayjs'
import { getCache, removeCache, setCache } from './storage'
import { AccessTokenCacheKey, LoginCacheKey, RefreshTokenCacheKey } from '@/store/storeName'
import { deepClone } from './utils'

import { doStoreLoginApi } from '@/service/user'
import { $loginSync, checkLogin } from '@/utils/common'
import PAGE_CACHE_KEY from '@/maps/chaheKeys'
import { useLoginStore } from '@/store'
import { currRoute, getNeedLoginPages } from '@/utils/index'
import { isWxMiniProgram } from '@/utils/platform'
import { ILoginRes } from '@/service/typings/user'

// 登录锁，用于防止并发登录
let loginPromise: Promise<any> | null = null

/**
 * 获取登录信息
 * @returns
 */
export function getLoginInfo() {
  return getCache(LoginCacheKey)?.loginInfo || undefined
}

/**
 * 获取accessToken
 * @returns
 */
export function getAccessToken() {
  return getCache(AccessTokenCacheKey) || ''
}

/**
 * 获取刷新token
 * @returns
 */
export function getRefreshToken() {
  return getCache(RefreshTokenCacheKey) || ''
}

/**
 * 设置登录信息
 * @param loginInfo
 * @param accessToken
 * @param refreshToken
 */
export function setLoginInfo(loginInfo: ILoginRes, accessToken: string, refreshToken: string) {
  const userLoginInfo = getCache(LoginCacheKey) || {}
  if (typeof userLoginInfo === 'object' && userLoginInfo !== null) {
    userLoginInfo.loginInfo = deepClone(loginInfo)
  }
  console.log({ userLoginInfo })
  setCache(LoginCacheKey, userLoginInfo)
  setCache(AccessTokenCacheKey, accessToken)
  setCache(RefreshTokenCacheKey, refreshToken)
}

/**
 * 清除登录信息
 */
export function removeLoginInfo() {
  removeCache(LoginCacheKey)
  removeCache(AccessTokenCacheKey)
  removeCache(RefreshTokenCacheKey)
}

/**
 * 更新token
 * @param accessToken
 * @param refreshToken
 */
export function updateToken(accessToken: string, refreshToken: string) {
  const loginInfo = getLoginInfo() || false
  if (!loginInfo) return
  accessToken = Array.isArray(accessToken) ? accessToken[0] : accessToken
  refreshToken = Array.isArray(refreshToken) ? refreshToken[0] : refreshToken
  loginInfo.accessToken = accessToken
  loginInfo.refreshToken = refreshToken

  const { expireTimeMinute = '', expireTime = '' } = loginInfo
  const refreshToken_fmt_expireTime = dayjs(new Date())
    .add(expireTimeMinute, 'minute')
    .format('YYYY/MM/DD HH:mm:ss')
  loginInfo.expireTime = refreshToken_fmt_expireTime
  console.log(
    'token过期时间:',
    expireTime,
    ', 过期分钟:',
    expireTimeMinute,
    ',下次过期时间: ',
    refreshToken_fmt_expireTime,
    ',accessToken:',
    accessToken,
    ',refreshToken:',
    refreshToken,
  )
  setLoginInfo(loginInfo, accessToken, refreshToken)
}

export async function onWxLogin() {
  // 如果正在登录，直接返回正在进行的登录Promise
  if (loginPromise) {
    return loginPromise
  }

  // 创建新的登录Promise
  loginPromise = new Promise(async (resolve) => {
    try {
      const wxCode = await $loginSync()
      const res = await doStoreLoginApi({
        code: wxCode,
        clientId: import.meta.env.VITE_APP_CLIENT_ID,
        grantType: import.meta.env.VITE_APP_GRANT_TYPE,
      })

      if (res.code !== 200) {
        setCache(PAGE_CACHE_KEY.WXLoginCode, '400')
        resolve(false)
      } else {
        const accessToken = res?.data?.accessToken
        // const refreshToken = res?.data?.refreshToken
        if (res?.success && res?.data) {
          const loginStore = useLoginStore()
          loginStore.setLoginInfo(res.data)

          setCache(AccessTokenCacheKey, accessToken)
          // setCache(RefreshTokenCacheKey, refreshToken)
        }
        removeCache(PAGE_CACHE_KEY.WXLoginCode)
        resolve(res.data)
      }
    } finally {
      // 登录完成，清空登录锁
      loginPromise = null
    }
  })

  return loginPromise
}

/**
 * 确保需要登录的页面先完成自动登录
 * 用于需要登录的页面，在发送请求前先确保登录完成
 * @returns Promise<void> 登录完成或不需要登录时resolve
 */
export async function ensureLoginBeforeRequest(): Promise<void> {
  // 获取当前页面路径
  const { path } = currRoute()
  const needLoginPages = getNeedLoginPages()
  const isNeedLogin = needLoginPages.includes(path)

  // 如果页面需要登录，且未登录，且是微信小程序，先等待自动登录完成
  if (isNeedLogin && !checkLogin() && isWxMiniProgram) {
    try {
      await onWxLogin()
      // 登录成功或失败都继续，由HTTP拦截器处理401
    } catch (error) {
      // 登录失败静默处理，可能是新用户，让用户继续体验
      console.log('自动登录失败:', error)
    }
  }
}
