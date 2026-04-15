<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { checkForUpdate } from '@/utils/checkAppVersion'
import { PageKey } from './maps/pageKeys'
import { getLoginInfo } from './utils/login'
import PLATFORM from './utils/platform'

onLaunch(() => {
  console.log('App Launch')

  // uni.hideTabBar()

  // #ifdef APP-PLUS
  // 默认竖屏
  plus.screen.lockOrientation('portrait-primary')
  // 如果是安卓端 检查App更新
  if (PLATFORM.isAndroid) {
    uni.hideTabBar()
    checkForUpdate(true)
  }
  // #endif

  // 租车的英文
  //

  // 每次進入應用時，進入對應的頁面
  // 正式版执行以下代码
  // if (import.meta.env.VITE_NODE_ENV === 'production') {
  //   const timer = setTimeout(() => {
  //     const loginInfo = getLoginInfo()
  //     console.log('loginInfo', loginInfo)
  //     if (!loginInfo?.accessToken) {
  //       uni.reLaunch({ url: PageKey.LOGIN })
  //     } else {
  //       uni.reLaunch({ url: PageKey.INDEX })
  //     }
  //     clearTimeout(timer)
  //   }, 100)
  // }
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<template>
  <view>
    <slot></slot>
  </view>
</template>

<style lang="scss"></style>
