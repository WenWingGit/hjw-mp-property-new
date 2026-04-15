<template>
  <view class="sx-gap-4 flex items-center" @click="onClickItem">
    <slot></slot>
    <Pic v-if="!props.value" width="32rpx" height="32rpx" src="/static/images/icon_select.svg" />
    <Pic v-else width="32rpx" height="32rpx" src="/static/images/icon_selected.svg" />
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  value: boolean | number
}
const props = withDefaults(defineProps<IProps>(), {
  value: false,
})

const emit = defineEmits<{
  (e: 'update:value', value: boolean): void
}>()

const onClickItem = () => {
  emit('update:value', !props.value)
}
</script>

<style lang="scss" scoped>
//
</style>
