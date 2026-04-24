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
    <NavTopBar title="登录" title-color="#1a1a1a" is-show-back btn-theme="black" />

    <view v-if="isPageReady">
      <view class="sx-pt-20"></view>
      <view class="relative z-2 fc flex-col page-container">
        <view class="box-border rounded-2 w-full sx-px-25 sx-pt-40 sx-pb-60">
          <view class="fc flex-col title-style">
            <view class="sx-fz-40 font-bold sx-pt-30 sx-pb-80">欢迎登录</view>
          </view>
          <view class="fc">
            <Pic width="200rpx" height="200rpx" src="/static/images/logo.png" />
          </view>

          <view class="sx-pt-25">
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
                  <text class="color-primary" @click="handleNavToAgreement">
                    《汇景湾用户协议》 《汇景湾隐私政策》
                  </text>
                </view>
              </view>
            </view>
          </view>

          <view class="sx-mt-20"></view>
        </view>
      </view>
    </view>
    <Loading v-else />
  </view>
</template>

<script lang="ts" setup>
import { navToHome } from '@/utils/index'
import { useLoginStore } from '@/store/login'
import { $hideLoading, $loginSync, $navBack, $reNav, $showLoading, $tips } from '@/utils/common'
import { getCache } from '@/utils/storage'
import { LoginCacheKey } from '@/store/storeName'
import Loading from '@/components/common/Loading/Loading.vue'
import { PageKey } from '@/maps/pageKeys'

const loginStore = useLoginStore()

onLoad((options) => {
  redirectUrl.value = decodeURIComponent(options?.redirectUrl || '')
})

const isPageReady = ref(false)

onReady(() => {
  // 已经登录就去首页
  const timer = setTimeout(() => {
    const hasLogin = getCache(LoginCacheKey)
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

function jump() {
  $tips('登录成功').then(() => {
    $reNav(redirectUrl.value || PageKey.INDEX)
  })
}

const handleWxLogin = async (e: any) => {
  console.log(e)
  if (e.errMsg !== 'getPhoneNumber:ok') {
    $tips('获取手机号失败')
    return
  }
  const { code: phoneCode } = e
  const wxCode = await $loginSync()

  $showLoading('登录中...')
  loginStore
    .doLoginByWxPhoneCode({
      clientId: 'f05ca7f4bb3a4f5da94e721923afdb0e',
      grantType: 'applet',
      code: wxCode,
      phoneCode,
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
}

const showAgreeTips = () => {
  if (!isAgree.value) {
    $tips('请先同意用户协议')
  }
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
  background-color: #f7f7f7;
  border-radius: 30rpx;
  overflow: hidden;
  padding: 0 34rpx;
}

.f-item {
  margin: 36rpx auto 42rpx;
  width: 100%;
  position: relative;
}

.f-input-wrap {
  width: 100%;
  height: 90rpx;
  padding: 0 20rpx !important;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 20rpx;
}

:deep(.f-input) {
  position: relative;
  overflow: hidden;
  // border-bottom: 2rpx solid #dedede;
  display: flex;
  align-items: center;
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
  z-index: 2;
  position: absolute;
  right: 14rpx;
  top: 50%;
  transform: translateY(-50%);
}

.send-code {
  width: auto;
  padding: 0 24rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ef8200;
  color: #fff;
  font-size: 25rpx;
  border-radius: 16rpx;
}
</style>
