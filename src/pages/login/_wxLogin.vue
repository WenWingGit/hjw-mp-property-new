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

    <NavTopBar title="登录" title-color="#1a1a1a" is-show-back btn-theme="black" />

    <view v-if="isPageReady">
      <view class="sx-pt-20"></view>
      <view class="relative z-2 fc flex-col page-container">
        <view class="box-border rounded-2 w-full sx-px-25 sx-pt-40 sx-pb-60">
          <view class="fc flex-col title-style">
            <view class="sx-fz-40 font-bold sx-pt-30 sx-pb-80">欢迎登录</view>
          </view>
          <view class="fc">
            <image
              style="width: 200rpx; height: 200rpx"
              src="/static/images/icon_logo_has_name.svg"
            ></image>
          </view>

          <view class="sx-pt-25">
            <!-- <view class="f-item">
              <view class="f-input-wrap">
                <wd-input
                  class="f-input"
                  type="text"
                  :maxlength="20"
                  placeholder="请输入手机号"
                  v-model="loginForm.phone"
                />
              </view>
            </view> -->

            <!-- <view class="f-item">
              <view class="f-input-wrap">
                <wd-input
                  class="f-input"
                  show-password
                  :maxlength="20"
                  placeholder="请输入密码"
                  v-model="loginForm.password"
                />
              </view>
            </view> -->

            <!-- 验证码 -->
            <!-- <view class="f-item">
              <view class="f-input-wrap">
                <wd-input
                  class="f-input"
                  :maxlength="6"
                  placeholder="请输入验证码"
                  v-model="loginForm.verificationCode"
                  confirm-type="done"
                  @confirm="handleSubmit"
                />
                <view class="f-input-code">
                  <view class="send-code" @click="handleGetCodeFn()">
                    {{ getCodeText }}
                  </view>
                </view>
              </view>
            </view> -->

            <!-- <view class="w-full flex justify-between items-center sx-mb-15 sx-fz-26">
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
              <view class="sx-color-999 sx-pl-10 sx-fz-13" @click="handleNavToForgetPassword">
                修改密码
              </view>
            </view> -->

            <!-- <wd-button block size="large" @click="handleSubmit">登录</wd-button> -->
            <wd-button v-if="!isAgree" block size="large" @click="showAgreeTips">
              一键授权
            </wd-button>
            <wd-button
              v-else
              block
              size="large"
              open-type="getPhoneNumber"
              @getphonenumber="handleWxLogin"
            >
              一键授权
            </wd-button>
            <view class="sx-mt-30"></view>
            <wd-button block type="info" size="large" @click="$navBack">暂不登录</wd-button>

            <view class="sx-mt-80 w-full flex justify-between items-center sx-mb-20 sx-fz-26">
              <view class="flex items-center" @click="toggleAgree(!isAgree)">
                <AppIcon
                  v-if="!isAgree"
                  icon="icon-weixuanzhong"
                  size="42rpx"
                  color="#b2b2b2"
                ></AppIcon>
                <AppIcon
                  v-else
                  icon="icon-chenggong1"
                  size="42rpx"
                  color="var(--primary-color)"
                ></AppIcon>
                <view class="sx-ml-5 color-999 clickable">
                  我已阅读并同意
                  <text class="color-primary" @click="handleNavToAgreement">《易联服务协议》</text>
                </view>
              </view>
            </view>
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
import { $hideLoading, $loginSync, $navBack, $reNav, $showLoading, $tips } from '@/utils/common'
import { getCache } from '@/utils/storage'
import { LoginCacheKey } from '@/store/storeName'
import CheckTest from '@/components/common/CheckTest.vue'
import { PageKey } from '@/maps/pageKeys'
import PAGE_CACHE_KEY from '@/maps/chaheKeys'

const toast = useToast()

const LoginPage = PageKey.LOGIN
const HomePage = PageKey.INDEX

const loginStore = useLoginStore()

onLoad((options) => {
  redirectUrl.value = decodeURIComponent(options.redirect)

  if (saveLoginInfo?.value) {
    const [_saveLoginInfo] = saveLoginInfo.value
    if (_saveLoginInfo.account) {
      loginForm.phone = _saveLoginInfo.account
    }
    if (_saveLoginInfo.password) {
      // loginForm.password = _saveLoginInfo.password
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
  // password: import.meta.env.DEV ? '123456' : '',
  verificationCode: '',
  wxCode: '',
})

function jump() {
  $tips('登录成功').then(() => {
    $reNav(redirectUrl.value || PageKey.INDEX)
  })
}

// old
const handleSubmit = async () => {
  // if (!isAgree.value) {
  //   toast.show('请先同意用户协议')
  //   return
  // }

  if (loginForm.phone === '') {
    $tips('请输入手机号')
    return
  }
  if (loginForm.verificationCode === '') {
    $tips('请输入验证码')
    return
  }

  loginForm.wxCode = await $loginSync()

  $showLoading('登录中...')

  loginForm.verificationCode = loginForm.verificationCode.trim()

  const salesUserId = getCache(PAGE_CACHE_KEY.SalesUserId) || 0

  loginStore
    .doLogin({ ...loginForm, salesUserId })
    .then((res) => {
      if (res) {
        const saveInfo: ISaveLoginInfo = {
          account: loginForm.phone,
        }
        if (isRememberPassword.storeUser) {
          // saveInfo.password = loginForm.password
        } else {
          saveInfo.password = ''
        }
        saveLoginInfoStore.saveAccountInfo(saveInfo)
        jump()
      }
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      $hideLoading()
    })
}

const handleWxLogin = async (e) => {
  console.log(e)
  if (e.errMsg !== 'getPhoneNumber:ok') {
    $tips('获取手机号失败')
    return
  }
  const { code, encryptedData, iv } = e
  const wxCode = await $loginSync()

  $showLoading('登录中...')
  loginStore
    .doLoginByWxPhoneCode({
      phoneCode: code,
      wxCode,
      encryptedData,
      iv,
      salesUserId: getCache(PAGE_CACHE_KEY.SalesUserId) || 0,
    })
    .then((res) => {
      if (res) {
        jump()
      }
    })
    .catch((err) => {
      console.log(err)
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

const showAgreeTips = () => {
  if (!isAgree.value) {
    $tips('请先同意用户协议')
  }
}

// 记住密码
const isRememberPassword = reactive<{ storeUser: boolean }>({
  // 店员
  storeUser: false,
})
function toggleRememberPassword(flag: boolean | object, key: string) {
  isRememberPassword[key] = typeof flag === 'object' ? !isRememberPassword[key] : flag
}

const { getCodeText, handleGetCode } = useSendCode()

function handleGetCodeFn() {
  handleGetCode(loginForm.phone, () => {
    if (isAgree.value) {
      return {
        success: true,
        message: '通过',
      }
    }
    return {
      success: false,
      message: '请先同意《易联服务协议》',
    }
  })
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
.page {
  background-color: #f7f7f7;
}
.form {
  padding: 0 34rpx;
  overflow: hidden;
  background-color: #f7f7f7;
  border-radius: 30rpx;
}

.f-item {
  position: relative;
  width: 100%;
  margin: 36rpx auto 42rpx;
}

.f-input-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 90rpx;
  padding: 0 20rpx !important;
  background-color: #fff;
  border-radius: 20rpx;
}

:deep(.f-input) {
  position: relative;
  // border-bottom: 2rpx solid #dedede;
  display: flex;
  align-items: center;
  overflow: hidden;
}

:deep(.f-input-wrap .wd-input__inner) {
  height: 90rpx;
  border-bottom: 0 !important;
}

:deep(.wd-input::after),
:deep(.wd-input.is-not-empty:not(.is-disabled)::after) {
  display: none !important;
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
  position: absolute;
  top: 50%;
  right: 14rpx;
  z-index: 2;
  transform: translateY(-50%);
}

.send-code {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 60rpx;
  padding: 0 24rpx;
  font-size: 25rpx;
  color: #fff;
  background-color: #ef8200;
  border-radius: 16rpx;
}
</style>
