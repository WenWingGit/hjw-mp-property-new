<template>
  <wd-config-provider :themeVars="themeVars">
    <view class="default-page page" :data-theme="themeName">
      <CheckTest />
      <slot></slot>
    </view>

    <wd-toast />
    <wd-message-box />

    <DownloadProgress
      :visible="downloadProgress.visible"
      :version="downloadProgress.version"
      :progress="downloadProgress.progress"
      :current-size="downloadProgress.currentSize"
      :total-size="downloadProgress.totalSize"
      :status="downloadProgress.status"
    />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import { useMessage, type ConfigProviderThemeVars } from 'wot-design-uni'
import { useLoginStore } from '@/store'
import DownloadProgress from '@/components/common/DownloadProgress.vue'
import { downloadProgress } from '@/utils/checkAppVersion'
import CheckTest from '@/components/common/CheckTest.vue'
import { ThemeColorConfigEnum, ThemeConfigEnum } from '@/theme'
import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'
import { UniOnEvents } from '@/maps/uniEvents'
import { PageKey } from '@/maps/pageKeys'
import { $loginSync, $nav } from '@/utils/common'

const message = useMessage()

const loginStore = useLoginStore()
const themeStore = useThemeStore()

const { themeName } = storeToRefs(themeStore)

// wot-design-uni 主題變量配置 根据用户角色设置主题
const themeVars = computed(() => {
  const themeColor = ThemeColorConfigEnum[themeName.value]
  return {
    colorTheme: themeColor,
    // buttonPrimaryBgColor: '#07c160',
    // buttonPrimaryColor: '#07c160',
  } as ConfigProviderThemeVars
})

const isPageShow = ref(false)

/** 处理未登录回调 */
function handleNoLoginCallBack(redirectUrl: string) {
  message
    .confirm({
      title: '提示',
      msg: '请先授权',
      confirmButtonText: '去授权',
      cancelButtonText: '暂不授权',
    })
    .then(() => {
      $nav(PageKey.LOGIN + `?redirect=${encodeURIComponent(redirectUrl)}`)
    })
    .catch(() => {})
}

onShow(() => {
  isPageShow.value = true
  uni.$on(UniOnEvents.NO_LOGIN, handleNoLoginCallBack)
})

onHide(() => {
  isPageShow.value = false
  uni.$off(UniOnEvents.NO_LOGIN)
})
</script>

<style lang="scss" scoped>
.default-page {
  // overflow: hidden;
}
</style>
