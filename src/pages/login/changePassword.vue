<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '修改密码',
  },
}
</route>

<template>
  <view class="page">
    <view class="relative z-2">
      <PageNavBar id="page-nav-bar-wrapper" title="修改密码" show-back />

      <view class="page-container sx-pt-20">
        <view class="form-content box-white">
          <wd-cell-group>
            <!-- 旧密码 -->
            <wd-input
              label="旧密码"
              center
              required
              v-model="formData.oldPassword"
              placeholder="请输入旧密码"
            />
            <!-- 新密码 -->
            <wd-input
              label="新密码"
              center
              required
              v-model="formData.newPassword"
              placeholder="请输入新密码"
            />
            <!-- 确认密码 -->
            <wd-input
              label="确认密码"
              center
              required
              v-model="formData.confirmPassword"
              placeholder="请输入确认密码"
            />
          </wd-cell-group>
        </view>
      </view>
    </view>

    <BottomBar confirm-text="修改密码" :loading="isSubmiting" @confirm="handleSubmit"></BottomBar>
  </view>
</template>

<script lang="ts" setup>
import { $tips } from '@/utils/common'
import { changePasswordApi } from '@/service/common/account'
import { useMessage } from 'wot-design-uni'
import { useLoginStore } from '@/store/login'
import { storeToRefs } from 'pinia'

const loginStore = useLoginStore()
const { userInfo } = storeToRefs(loginStore)

const message = useMessage()

const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isSubmiting = ref(false)

function handleSubmit() {
  isSubmiting.value = true
  if (formData.newPassword !== formData.confirmPassword) {
    $tips('新密码与确认密码不一致')
    return
  }

  changePasswordApi({
    id: userInfo.value?.id ?? 0,
    oldPassword: formData.oldPassword,
    newPassword: formData.newPassword,
    confirmNewPassword: formData.confirmPassword,
  }).then((res) => {
    if (res?.success) {
      message.alert('修改密码成功').then(() => {
        uni.navigateBack({ delta: 1 })
      })
    }
  })
}
</script>

<style lang="scss" scoped>
//
</style>
