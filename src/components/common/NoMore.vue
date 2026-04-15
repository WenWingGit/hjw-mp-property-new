<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '没有更多了',
  },
})
</script>

<template>
  <view class="no-more">
    {{ text }}
  </view>
</template>

<style lang="scss" scoped>
.no-more {
  text-align: center;
  color: #999999;
  font-size: 28rpx;
  padding: 20rpx 0;
}
</style>
