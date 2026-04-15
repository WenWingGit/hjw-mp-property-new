<template>
  <!-- <view class="loading-wrapper" :class="{ full }" :style="{ 'background-color': bg }">
    <wd-loading :size="size" />
  </view> -->
  <view></view>
</template>

<script lang="ts" setup>
// import { storeToRefs } from 'pinia'

interface IProps {
  color?: string
  size?: number | string
  full: boolean
  bg: string
}
const props = withDefaults(defineProps<IProps>(), {
  color: '',
  size: 33,
  full: true,
  bg: 'transparent',
})

// const themeStore = useThemeStore()
// const { curThemeColor } = storeToRefs(themeStore)
//
// const loadingColor = computed(() => props.color || curThemeColor.value)
</script>

<style lang="scss" scoped>
.loading-wrapper {
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20rrpx 0;
}
.full {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
