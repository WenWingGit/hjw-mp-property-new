<template>
  <view>
    <view class="tabbar-placeholder"></view>
    <view class="tabbar" @touchmove.stop.prevent="() => {}">
      <view
        v-for="(tabItem, tabIndex) in tabbarList"
        :key="tabIndex"
        :name="tabItem.tabName"
        class="tab-item"
        @click="onChangeTab(tabItem.tabName)"
      >
        <wd-img
          v-if="curTabbar === tabItem.tabName"
          class="tabbar-icon"
          :width="tabItem.iconOn.width + 'rpx'"
          :height="tabItem.iconOn.height + 'rpx'"
          :src="tabItem.iconOn.url"
          mode="aspectFit"
        ></wd-img>
        <wd-img
          v-else
          class="tabbar-icon"
          :width="tabItem.icon.width + 'rpx'"
          :height="tabItem.icon.height + 'rpx'"
          :src="tabItem.icon.url"
          mode="aspectFit"
        ></wd-img>
        <view class="tabbar-name">
          {{ tabItem.name }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import iconTabbarHome from '@/static/tabbar/icon_tabbar_home.svg'
import iconTabbarHomeOn from '@/static/tabbar/icon_tabbar_home_on.svg'
import iconTabbarCar from '@/static/tabbar/icon_tabbar_car.svg'
import iconTabbarCarOn from '@/static/tabbar/icon_tabbar_car_on.svg'
import iconTabbarMine from '@/static/tabbar/icon_tabbar_mine.svg'
import iconTabbarMineOn from '@/static/tabbar/icon_tabbar_mine_on.svg'

import { useLoginStore } from '@/store'
const loginStore = useLoginStore()

/* eslint-disable */

const TabbarItem_Home = {
  id: 1,
  name: '首页',
  tabName: 'home',
  openType: 'switchTab',
  url: '/pages/index/index',
  icon: {
    width: 36,
    height: 36,
    url: iconTabbarHome,
  },
  iconOn: {
    width: 36,
    height: 36,
    url: iconTabbarHomeOn,
  },
}
const TabbarItem_Car = {
  id: 2,
  name: '选车',
  tabName: 'todo',
  openType: 'switchTab',
  url: '/pages/selectCar/selectCar',
  icon: {
    width: 36,
    height: 36,
    url: iconTabbarCar,
  },
  iconOn: {
    width: 36,
    height: 36,
    url: iconTabbarCarOn,
  },
}
const TabbarItem_Mine = {
  id: 3,
  name: '我的',
  tabName: 'mine',
  openType: 'switchTab',
  url: '/pages/mine/mine',
  icon: {
    width: 36,
    height: 36,
    url: iconTabbarMine,
  },
  iconOn: {
    width: 36,
    height: 36,
    url: iconTabbarMineOn,
  },
}

const tabbarList = computed(() => {
  let tabbar = [TabbarItem_Home, TabbarItem_Car, TabbarItem_Mine]
  return tabbar
})

const isLoading = ref(true)
const curTabbar = ref()
const oldCurTabbar = ref()

onLoad(() => {
  isLoading.value = true
  uni.hideTabBar({
    success: () => {
      console.log('hideTabBar success')
    },
    fail: (err) => {
      console.log('hideTabBar fail', err)
    },
  })
  setCurTab()
  isLoading.value = false
})

onShow(() => {
  if (!isLoading.value) {
    setCurTab()
  }
})

function setCurTab() {
  // 获取当前路径
  const pages = getCurrentPages()
  if (pages.length) {
    const path = pages.pop().route
    let idx = tabbarList.value.map((item) => item?.url).findIndex((r) => r.includes(path))
    if (idx > -1) {
      curTabbar.value = tabbarList.value[idx].tabName
    }
    oldCurTabbar.value = curTabbar.value
  }
}

const onChangeTab = (tabName: string) => {
  if (tabName === oldCurTabbar.value) {
    return
  }
  let tabbarItem = null
  tabbarItem = tabbarList.value.find((item) => item.tabName === tabName)
  const url = tabbarItem.url
  if (tabbarItem.openType === 'switchTab') {
    uni.switchTab({
      url,
      success: (success) => {
        curTabbar.value = tabName
        oldCurTabbar.value = tabName
      },
    })
  } else if (tabbarItem.openType === 'navigateTo') {
    uni.navigateTo({
      url,
      success: (success) => {
        curTabbar.value = tabName
        oldCurTabbar.value = tabName
      },
    })
  }
}
</script>

<style lang="scss" scoped>
.tabbar-placeholder {
  width: 100%;
  height: 112rpx;
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
  padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
}
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 98;
  height: 112rpx;
  box-sizing: content-box;
  display: flex;
  background-color: #fff;
  box-shadow: 0rpx -9rpx 21rpx 0rpx rgba(0, 0, 0, 0.06);
  padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
  padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
}
.tab-item {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  .count {
    position: absolute;
    top: 10rpx;
    right: 70rpx;
    background-color: var(--danger-color);
    color: #fff;
    border-radius: 50%;
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    z-index: 2;
  }
}
.tabbar-name {
  font-size: 27rpx;
  line-height: 1;
  padding-top: 10rpx;
  padding-bottom: 12rpx;
}
</style>
