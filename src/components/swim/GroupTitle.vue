<template>
  <view class="group-title">
    <view class="title-line"></view>
    <text class="title-text">{{ title }}</text>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title?: string
}>()
</script>

<style lang="scss" scoped>
.group-title {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.title-line {
  width: 8rpx;
  height: 28rpx;
  background: linear-gradient(180deg, #feca58 0%, #f1383b 100%);
  border-radius: 10rpx;
  margin-right: 16rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #333333;
}
</style>

