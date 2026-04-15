<route lang="json5" type="home">
{
  style: {
    navigationBarTitleText: '汇景湾物业缴费',
    hidesTabBar: true,
    navigationStyle: 'custom',
    navigationBarTextStyle: 'black',
  },
}
</route>
<template>
  <view class="index-page">
    <NavTopBar bg-color="#fff" title-color="#1a1a1a" btn-theme="black" title="汇景湾物业缴费" />

    <view class="header-bg"></view>

    <view class="page-container">
      <view class="hero-section flex items-center justify-between">
        <view class="hero-text primary-color">
          <view class="text-line">智慧</view>
          <view class="text-line">生活</view>
        </view>
        <image class="hero-image" :src="b1" mode="widthFix" />
      </view>

      <view class="menu-section">
        <GroupTitle title="物业服务" />
        <view class="menu-grid">
          <view
            v-for="(item, index) in menuList"
            :key="index"
            class="menu-item-wrapper"
            @click="handleNav(item.path)"
          >
            <view class="menu-item" :style="{ backgroundColor: item.bgVal }">
              <view class="menu-info">
                <text class="menu-title">{{ item.title }}</text>
                <text class="menu-desc">{{ item.desc.toUpperCase() }}</text>
              </view>
              <image class="menu-icon" :src="item.icon" mode="aspectFit" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import AppIcon from '@/components/common/AppIcon/AppIcon.vue'
import c1 from '@/static/images/c1.svg'
import c2 from '@/static/images/c2.svg'
import c3 from '@/static/images/c3.svg'
import c4 from '@/static/images/c4.svg'
import c5 from '@/static/images/c5.svg'
import c6 from '@/static/images/c6.svg'
import b1 from '@/static/images/b1.png'
import GroupTitle from '@/components/swim/GroupTitle.vue'
import { handleSalesUserIdOnLoad } from '@/utils'

const menuList = [
  {
    title: '物业缴费',
    desc: 'payment',
    icon: c2,
    bgVal: '#FFF0DE',
    path: '/pages/billList/billList',
  },
  {
    title: '充值',
    desc: 'appointment',
    icon: c1,
    bgVal: '#F2EEFF',
    path: '/pages/',
  },
]

const handleNav = (path: string) => {
  uni.navigateTo({
    url: `${path}`,
  })
}

const isLoaded = ref(false)
onLoad(async (options) => {
  await handleSalesUserIdOnLoad(options)
  // 自动登录逻辑已统一在HTTP拦截器中处理，无需在每个页面重复
  // 直接加载数据，如果接口支持未登录访问，会正常返回
  // 如果接口需要登录，会收到401，由HTTP拦截器处理
  isLoaded.value = true
})
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background-color: #fbfaf8;
}
.header-bg {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 44vh;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(252, 220, 179, 0.5) 0%,
    rgba(255, 250, 244, 0.5) 44%,
    rgba(255, 252, 248, 0.5) 100%
  );
}

.content {
  position: relative;
  z-index: 2;
  padding: 0 32rpx;
}

.hero-section {
  padding: 40rpx 0;
  .hero-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin-right: -80rpx;
    text-align: center;

    .text-line {
      font-size: 48rpx;
      line-height: 1.4;
      letter-spacing: 10rpx;
    }
  }
  .hero-image {
    width: 630rpx;
    margin-right: -80rpx;
  }
}

.menu-section {
  position: relative;
  z-index: 2;
  margin-top: 20rpx;
  .section-title {
    margin-bottom: 32rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

.menu-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx; // 抵消 item 的 gap
}

.menu-item-wrapper {
  box-sizing: border-box;
  width: 50%;
  padding: 10rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-radius: 20rpx;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }

  .menu-info {
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .menu-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }

    .menu-desc {
      font-size: 20rpx;
      color: #999;
    }
  }

  .menu-icon {
    width: 88rpx;
    height: 88rpx;
  }
}
</style>
