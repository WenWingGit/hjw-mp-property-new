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
      <view class="sx-pt-100"></view>
      <view class="relative z-2 fc flex-col page-container">
        <view class="bg-white box-border rounded-2 w-full sx-px-25 sx-pt-40 sx-pb-60">
          <view class="fc flex-col title-style">
            <view class="sx-fz-48 font-bold sx-pb-20">欢迎登录</view>
          </view>
          <view class="fc">
            <Pic width="200rpx" height="200rpx" src="/static/images/logo.png" />
          </view>

          <view class="sx-pt-25">
            <view class="f-item">
              <view class="f-input-wrap">
                <wd-input
                  class="f-input"
                  type="text"
                  :maxlength="20"
                  placeholder="请输入账号"
                  v-model="loginForm.username"
                />
              </view>
            </view>

            <view class="f-item">
              <view class="f-input-wrap">
                <wd-input
                  class="f-input"
                  show-password
                  placeholder="请输入密码"
                  v-model="loginForm.password"
                />
              </view>
            </view>

            <wd-button block size="large" @click="handleSubmit">登录</wd-button>

            <view class="sx-mt-20 w-full flex justify-between items-center sx-mb-20 sx-fz-26">
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
                  <text @click="toggleAgree">我已阅读并同意</text>
                  <text class="color-primary" @click="handleNavToAgreement">
                    《用户协议》和《隐私政策》
                  </text>
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
import { useLoginStore } from '@/store/login'
import { storeToRefs } from 'pinia'
import { type ISaveLoginInfo } from '@/typings'
import { ILoginAccountReq } from '@/service/typings/user'

import { useMessage, useToast } from 'wot-design-uni'
import { $hideLoading, $showLoading, $tips } from '@/utils/common'
import { getCache } from '@/utils/storage'
import { LoginCacheKey } from '@/store/storeName'
import CheckTest from '@/components/common/CheckTest.vue'

const toast = useToast()

const LoginPage = import.meta.env.VITE_APP_LOGIN_PAGE
const HomePage = import.meta.env.VITE_APP_HOME_PAGE

const loginStore = useLoginStore()

onLoad(() => {
  const route = currRoute()
  redirectUrl.value = route.query.redirect
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
  username: import.meta.env.DEV ? 'jie' : 'jie',
  password: import.meta.env.DEV ? 'sxroot123' : 'sxroot123',
  clientId: '195da9fcce574852b850068771cde034',
  grantType: 'password',
  iv: '1ppX054Z5WCyp52v',
  requestId: 'e5de8cb7de93d830307a77318196aeffae80c1ce02f8d0954adfe72fe7d56054',
})

function jump() {
  const url = redirectUrl.value || HomePage
  $tips('登录成功')
  uni.redirectTo({ url })
}

const handleSubmit = () => {
  if (!isAgree.value) {
    toast.show('请先同意用户协议')
    return
  }
  if (loginForm.username === '') {
    toast.show('请输入账号')
    return
  }
  if (loginForm.password === '') {
    toast.show('请输入密码')
    return
  }

  $showLoading('登录中...')

  loginStore
    .doLoginByWxPhoneCode({ ...loginForm })
    .then((res) => {
      if (res) {
        jump()
      }
    })
    .finally(() => {
      $hideLoading()
    })
}

// 同意协议
const isAgree = ref(true)
const toggleAgree = (flag: boolean) => {
  isAgree.value = typeof flag === 'object' ? !isAgree.value : flag
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
  padding: 0 34rpx;
  overflow: hidden;
  background-color: #fff;
  border-radius: 30rpx;
}

.f-item {
  position: relative;
  width: 100%;
  margin: 36rpx auto 42rpx;
}

.f-input {
  position: relative;
  // border-bottom: 2rpx solid #dedede;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 90rpx;
  padding: 0 20rpx;
  overflow: hidden;
  background-color: #f8f8f8;
  border-radius: 6rpx;
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
  position: absolute;
  top: 50%;
  right: 14rpx;
  z-index: 2;
  transform: translateY(-50%);
}
</style>
