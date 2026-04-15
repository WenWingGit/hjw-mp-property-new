<template>
  <view class="iconfont" :class="icon" :style="{ color, 'font-size': size }"></view>
</template>

<script lang="ts" setup>
interface Props {
  color?: string
  size?: string
  icon?: string
}
const props = withDefaults(defineProps<Props>(), {
  size: '32rpx',
})
</script>

<style lang="scss" scoped>
//
</style>
