<route lang="json5">
{
  style: {
    navigationBarTitleText: '登录',
    'app-plus': {
      splashscreen: {
        // 是否自动隐藏启动界面
        autoShow: false,
      },
    },
  },
  layout: 'noSideDefault',
}
</route>

<template>
  <view class="page">
    <CheckTest />
    <view v-if="isPageReady">
      <view class="sx-pt-50"></view>
      <view class="relative z-2 fc flex-col page-container">
        <view class="bg-white box-border rounded-2 w-full sx-px-25 sx-pt-40 sx-pb-60">
          <view class="fc flex-col title-style">
            <view class="sx-fz-24 font-bold sx-pb-20">欢迎登录</view>
          </view>
          <view class="fc">
            <Pic
              width="200rpx"
              height="200rpx"
              src="/src/static/images/carRental/icon_logo_has_name.svg"
            />
          </view>

          <view class="sx-pt-25">
            <view class="f-item">
              <view class="f-input-wrap">
                <wd-input
                  class="f-input"
                  type="text"
                  :maxlength="20"
                  placeholder="请输入手机号"
                  v-model="loginForm.phone"
                />
              </view>
            </view>

            <view class="f-item">
              <view class="f-input-wrap">
                <wd-input
                  class="f-input"
                  show-password
                  :maxlength="20"
                  placeholder="请输入密码"
                  v-model="loginForm.password"
                />
              </view>
            </view>

            <!-- 验证码 -->
            <view class="f-item">
              <view class="f-input-wrap">
                <wd-input
                  class="f-input"
                  :maxlength="6"
                  placeholder="请输入验证码"
                  v-model="loginForm.captcha"
                  confirm-type="done"
                  @confirm="handleSubmit"
                />
                <view class="f-input-code">
                  <image
                    w="250rpx"
                    :src="captchaUrl"
                    mode="widthFix"
                    @click="refreshCaptcha"
                  ></image>
                </view>
                <!-- <view class="f-input-code" @click="handleGetCode(loginForm.phone)">
                  {{ getCodeText }}
                </view> -->
              </view>
            </view>

            <view class="w-full flex justify-between items-center sx-mb-15 sx-fz-13">
              <view class="flex items-center">
                <AppIcon
                  v-if="!isRememberPassword.storeUser"
                  icon="icon-weixuanzhong"
                  size="42rpx"
                  color="#b2b2b2"
                  @click="toggleRememberPassword(true, 'storeUser')"
                ></AppIcon>
                <AppIcon
                  v-else
                  icon="icon-chenggong1"
                  size="42rpx"
                  color="var(--primary-color)"
                  @click="toggleRememberPassword(false, 'storeUser')"
                ></AppIcon>
                <view
                  class="sx-ml-5 color-999"
                  @click="toggleRememberPassword($event, 'storeUser')"
                >
                  记住密码
                </view>
              </view>
              <!-- <view class="sx-color-999 sx-pl-10 sx-fz-13" @click="handleNavToForgetPassword">
                修改密码
              </view> -->
            </view>

            <wd-button block size="large" @click="handleSubmit">登录</wd-button>

            <wd-button class="sx-mt-10" block size="large" plain @click="handleNavToRegister">
              注册
            </wd-button>

            <!-- <view class="sx-mt-20 w-full flex justify-between items-center sx-mb-20 sx-fz-13">
              <view class="flex items-center">
                <AppIcon
                  v-if="!isAgree"
                  icon="icon-weixuanzhong"
                  size="42rpx"
                  color="#b2b2b2"
                  @click="toggleAgree(true)"
                ></AppIcon>
                <AppIcon
                  v-else
                  icon="icon-chenggong1"
                  size="42rpx"
                  color="var(--primary-color)"
                  @click="toggleAgree(false)"
                ></AppIcon>
                <view class="sx-ml-5 color-999 clickable">
                  我已阅读并同意
                  <text class="color-primary" @click="handleNavToAgreement">
                    《用户协议》和《隐私政策》
                  </text>
                </view>
              </view>
            </view> -->
          </view>

          <view class="sx-mt-20"></view>
        </view>
      </view>
    </view>
    <view v-else class="flex items-center justify-center flex-col h-screen">
      <wd-loading />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { currRoute, navToHome } from '@/utils/index'
import { useSaveLoginAccountStore } from '@/store/loginAccount'
import { useLoginStore } from '@/store/login'
import { storeToRefs } from 'pinia'
import { type ISaveLoginInfo } from '@/typings'
import { ILoginAccountReq } from '@/service/typings/user'

import { useMessage, useToast } from 'wot-design-uni'
import { $hideLoading, $showLoading } from '@/utils/common'
import { getCache } from '@/utils/storage'
import { LoginCacheKey } from '@/store/storeName'
import CheckTest from '@/components/common/CheckTest.vue'

const toast = useToast()

const LoginPage = import.meta.env.VITE_APP_LOGIN_PAGE
const HomePage = import.meta.env.VITE_APP_HOME_PAGE

const saveLoginInfoStore = useSaveLoginAccountStore()
const loginStore = useLoginStore()

const { saveLoginInfo } = storeToRefs(saveLoginInfoStore)

/** 验证码sessionId */
const verCodeSessinId = ref<string>(+new Date() + '123')

/** 验证码图片 */
const captchaUrl = computed(() => {
  return `${import.meta.env.VITE_SERVER_BASEURL}/Captcha/GetCaptcha?verCodeSessinId=${verCodeSessinId.value}`
})

onLoad(() => {
  const route = currRoute()
  redirectUrl.value = route.query.redirect

  if (typeof saveLoginInfoStore?.isAgree !== 'undefined') {
    isAgree.value = saveLoginInfoStore.isAgree
  }

  if (saveLoginInfo?.value) {
    const [_saveLoginInfo] = saveLoginInfo.value
    if (_saveLoginInfo.account) {
      loginForm.phone = _saveLoginInfo.account
    }
    if (_saveLoginInfo.password) {
      loginForm.password = _saveLoginInfo.password
      isRememberPassword.storeUser = true
    } else {
      isRememberPassword.storeUser = false
    }
  }
})

const isPageReady = ref(false)

onReady(() => {
  // 已经登录就去首页
  const timer = setTimeout(() => {
    const hasLogin = getCache(LoginCacheKey)
    // console.log(hasLogin?.loginInfo?.accessToken)
    if (hasLogin?.loginInfo?.accessToken) {
      navToHome()
    }
    const timer2 = setTimeout(() => {
      isPageReady.value = true
      clearTimeout(timer2)
    }, 300)
    clearTimeout(timer)
  }, 1000)
})

const redirectUrl = ref<string>('')

const loginForm = reactive<ILoginAccountReq>({
  phone: import.meta.env.DEV ? '13106955027' : '',
  password: import.meta.env.DEV ? '123456' : '',
  // phone: '',
  // password: '',
  verCodeSessinId: '',
  captcha: '',
})

function jump() {
  const url = HomePage
  toast.show({
    msg: '登录成功',
    cover: true,
    duration: 1500,
    closed: () => {
      uni.redirectTo({ url })
    },
  })
}

const handleSubmit = () => {
  // if (!isAgree.value) {
  //   toast.show('请先同意用户协议')
  //   return
  // }
  if (loginForm.phone === '') {
    toast.show('请输入手机号')
    return
  }
  if (loginForm.password === '') {
    toast.show('请输入密码')
    return
  }
  if (loginForm.captcha === '') {
    toast.show('请输入验证码')
    return
  }

  $showLoading('登录中...')

  loginForm.captcha = loginForm.captcha.trim()

  loginStore
    .doLogin({ ...loginForm, verCodeSessinId: verCodeSessinId.value })
    .then((res) => {
      if (res) {
        const saveInfo: ISaveLoginInfo = {
          account: loginForm.phone,
        }
        if (isRememberPassword.storeUser) {
          saveInfo.password = loginForm.password
        } else {
          saveInfo.password = ''
        }
        saveLoginInfoStore.saveAccountInfo(saveInfo)
        jump()
      }
    })
    .catch((err) => {
      console.log(err)
      refreshCaptcha()
    })
    .finally(() => {
      $hideLoading()
    })
}

// 同意协议
const isAgree = ref(true)
const toggleAgree = (flag: boolean) => {
  isAgree.value = typeof flag === 'object' ? !isAgree.value : flag

  saveLoginInfoStore.onChangeAgree(isAgree.value)
}

// 记住密码
const isRememberPassword = reactive<{ storeUser: boolean }>({
  // 店员
  storeUser: false,
})
function toggleRememberPassword(flag: boolean | object, key: string) {
  isRememberPassword[key] = typeof flag === 'object' ? !isRememberPassword[key] : flag
}

// const { getCodeText, handleGetCode } = useSendCode()

/** 刷新验证码 */
function refreshCaptcha() {
  verCodeSessinId.value = +new Date() + '123'
}

/** 跳转忘记密码 */
function handleNavToForgetPassword() {
  uni.navigateTo({
    url: '/pages/login/changePassword',
  })
}

/** 跳转注册 */
function handleNavToRegister() {
  uni.navigateTo({
    url: '/pages/login/register',
  })
}

/** 跳转协议 */
function handleNavToAgreement() {
  uni.navigateTo({
    url: '/pages/login/agreement',
  })
}
</script>

<style lang="scss" scoped>
.form {
  background-color: #fff;
  border-radius: 30rpx;
  overflow: hidden;
  padding: 0 34rpx;
}

.f-item {
  margin: 36rpx auto 42rpx;
  width: 100%;
  position: relative;
}

.f-input {
  position: relative;
  overflow: hidden;
  border-radius: 6rpx;
  background-color: #f8f8f8;
  // border-bottom: 2rpx solid #dedede;
  box-sizing: border-box;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  width: 100%;
  height: 90rpx;
}

.f-input::after,
.wd-input.is-not-empty:not(.is-disabled)::after {
  display: none;
}

.title-style {
  color: #172345;
}

:deep(.wd-picker__field) {
  width: 100%;
}
:deep(.wd-picker__cell) {
  background: transparent;
}
:deep(.wd-input__icon) {
  background-color: transparent !important;
}

.f-input-code {
  z-index: 2;
  position: absolute;
  right: 14rpx;
  top: 50%;
  transform: translateY(-50%);
}
</style>
