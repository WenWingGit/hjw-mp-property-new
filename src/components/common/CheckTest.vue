<template>
  <view v-if="isDevServer" class="dev-server-tip">测</view>
</template>

<script lang="ts" setup>
const isDevServer = computed(() => {
  return import.meta.env.VITE_SERVER_BASEURL.includes('192.168')
})
</script>

<style lang="scss" scoped>
.dev-server-tip {
  position: fixed;
  top: 0;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  background-color: red;
  border-radius: 10rpx;
  z-index: 99999;
  color: white;
  font-size: 24rpx;
  text-align: center;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
