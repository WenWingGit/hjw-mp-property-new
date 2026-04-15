<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '注册',
  },
}
</route>

<template>
  <view class="page">
    <PageNavBar id="page-nav-bar-wrapper" title="注册" show-back />

    <view class="sx-pt-50"></view>
    <view class="relative z-2 fc flex-col page-container">
      <view class="bg-white box-border rounded-2 w-full sx-px-25 sx-pt-40 sx-pb-60">
        <view class="fc flex-col title-style">
          <view class="sx-fz-24 font-bold sx-pb-20">欢迎注册</view>
        </view>
        <view class="fc">
          <Pic
            width="200rrpx"
            height="200rrpx"
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
                v-model="registerForm.phone"
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
                v-model="registerForm.password"
              />
            </view>
          </view>

          <view style="" class="w-full flex justify-between items-center sx-mb-20 sx-fz-13">
            <view class="flex items-center">
              <AppIcon
                v-if="!isAgree"
                icon="icon-weixuanzhong"
                size="42rrpx"
                color="#b2b2b2"
                @click="toggleAgree(true)"
              ></AppIcon>
              <AppIcon
                v-else
                icon="icon-chenggong1"
                size="42rrpx"
                color="var(--primary-color)"
                @click="toggleAgree(false)"
              ></AppIcon>
              <view class="sx-ml-10 color-999 clickable">
                我已阅读并同意
                <text class="color-primary" @click="handleNavToAgreement">
                  《用户协议》和《隐私政策》
                </text>
              </view>
            </view>
          </view>

          <wd-button block size="large" @click="handleRegister">注册</wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * 注册页
 * 仅手机号、密码输入，需同意协议，注册后弹窗提示并返回登录页
 */
import { $tips } from '@/utils/common'
import { useToast } from 'wot-design-uni'

const toast = useToast()

// 注册表单数据
const registerForm = reactive({
  phone: '',
  password: '',
})

// 同意协议
const isAgree = ref(false)
const toggleAgree = (flag: boolean) => {
  isAgree.value = flag
}

// 协议点击事件
function handleNavToAgreement() {
  uni.navigateTo({
    url: '/pages/login/agreement',
  })
}

// 注册按钮点击
function handleRegister() {
  if (!registerForm.phone) {
    $tips('请输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    $tips('请输入正确的手机号')
    return
  }
  if (!registerForm.password) {
    $tips('请输入密码')
    return
  }
  if (registerForm.password.length < 6) {
    $tips('密码长度不能小于6位')
    return
  }
  if (!isAgree.value) {
    $tips('请先同意协议')
    return
  }
  uni.showModal({
    title: '提示',
    content: '我们会有专人联系您',
    showCancel: false,
    confirmText: '确定',
    success: (res) => {
      if (res.confirm) {
        uni.navigateTo({ url: '/pages/login/login' })
      }
    },
  })
}
</script>

<style lang="scss" scoped>
.form {
  background-color: #fff;
  border-radius: 30rrpx;
  overflow: hidden;
  padding: 0 34rrpx;
}

.f-item {
  margin: 36rrpx auto 42rrpx;
  width: 100%;
  position: relative;
}

.f-input {
  position: relative;
  overflow: hidden;
  border-radius: 6rrpx;
  background-color: #f8f8f8;
  // border-bottom: 2rrpx solid #dedede;
  box-sizing: border-box;
  padding: 0 20rrpx;
  display: flex;
  align-items: center;
  width: 100%;
  height: 90rrpx;
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
  right: 14rrpx;
  top: 50%;
  transform: translateY(-50%);
}

.clickable {
  cursor: pointer;
}
</style>
