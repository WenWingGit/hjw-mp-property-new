import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  IGetUserInfoRes,
  type ILoginAccountReq,
  ILoginByWxPhoneCodeReq,
  ILoginRes,
  IUserInfo,
} from '@/service/typings/user'
import { doStoreLoginApi, getUserInfoApi, loginByWxPhoneCodeApi } from '@/service/user'
import { AccessTokenCacheKey, LoginCacheKey, RefreshTokenCacheKey } from './storeName'
import { setCache } from '@/utils/storage'

const initState = {
  userId: 0,
  accountType: 0,
  accessToken: '',
  refreshToken: '',
  expireTime: '',
  refreshExpireDay: 0,
  expireTimeMinute: 0,
}

export const useLoginStore = defineStore(
  LoginCacheKey,
  () => {
    // 登录信息
    const loginInfo = ref<Partial<ILoginRes>>({ ...initState })
    // 用户信息
    const userInfo = ref<IGetUserInfoRes>()

    // 是否已登录
    const isLogined = computed(() => !!loginInfo.value?.accessToken)

    // token
    const token = computed(() => loginInfo.value?.accessToken)

    const userId = computed(() => loginInfo.value?.userInfo?.id)

    /** 设置用户登录信息 */
    const setLoginInfo = (val: ILoginRes) => {
      loginInfo.value = val
    }

    /** 设置用户信息 */
    const setUserInfo = (val: IGetUserInfoRes) => {
      userInfo.value = val
    }

    /** 清除用户信息 */
    const clearUserInfo = () => {
      Object.assign(loginInfo.value, initState)
      userInfo.value = undefined
    }

    // 正式登录请使用此方法
    const doLogin = async (params: ILoginAccountReq) => {
      const res = await doStoreLoginApi(params)
      const accessToken = res?.data?.accessToken
      // const refreshToken = res?.data?.refreshToken
      if (res?.data) {
        setLoginInfo(res.data)
        setCache(AccessTokenCacheKey, accessToken)
        // setCache(RefreshTokenCacheKey, refreshToken)
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    }

    // 正式登录来自微信phoneCode
    const doLoginByWxPhoneCode = async (params: ILoginByWxPhoneCodeReq) => {
      const res = await loginByWxPhoneCodeApi(params)
      const accessToken = res?.data?.accessToken
      // const refreshToken = res?.data?.refreshToken
      if (res?.success && res?.data) {
        setLoginInfo(res.data)
        setCache(AccessTokenCacheKey, accessToken)
        // setCache(RefreshTokenCacheKey, refreshToken)
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    }

    const getUserInfo = async () => {
      getUserInfoApi().then((res) => {
        if (res?.success && res?.data) {
          setUserInfo(res.data)
        }
      })
    }

    return {
      loginInfo,
      userInfo,
      token,
      isLogined,
      userId,
      setLoginInfo,
      getUserInfo,
      setUserInfo,
      clearUserInfo,
      doLogin,
      doLoginByWxPhoneCode,
    }
  },
  {
    persist: true,
  },
)
