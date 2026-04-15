<template>
  <wd-popup
    :model-value="props.show"
    custom-style="border-radius: 16rrpx 16rrpx 0 0;"
    lock-scroll
    position="bottom"
    :z-index="props.zIndex"
    :safe-area-inset-bottom="true"
    @close="onClose"
  >
    <!-- @touchmove.stop.prevent="preventHandler" -->
    <view>
      <view class="flex items-center">
        <view class="left-btn" :style="{ width: topBtnWidth }">
          <slot name="left-btn"></slot>
        </view>
        <view v-if="title" class="fc sx-fz-32 font-bold flex-1" style="height: 100rpx">
          {{ title }}
        </view>
        <view class="right-btn" :style="{ width: topBtnWidth }">
          <slot name="right-btn"></slot>
        </view>
      </view>

      <view class="page-container">
        <scroll-view v-if="innerScroll" scroll-y :style="{ maxHeight }">
          <slot></slot>
        </scroll-view>
        <view v-else :style="{ maxHeight }" class="overflow-hidden">
          <slot></slot>
        </view>
      </view>
      <view class="border-line-top">
        <view class="page-container">
          <view class="flex justify-between items-center flex-gap-2" style="height: 120rpx">
            <view v-if="!alert" class="flex-1">
              <wd-button size="large" type="info" block @click="onCancel">
                {{ props.cancelText }}
              </wd-button>
            </view>
            <view class="flex-1">
              <wd-button size="large" block @click="onConfirm">
                {{ props.confirmText }}
              </wd-button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
interface IProps {
  show: boolean
  zIndex?: number
  confirmText?: string
  cancelText?: string
  alert?: boolean
  title?: string
  maxHeight?: string
  innerScroll?: boolean
  autoClose?: boolean
  topBtnWidth?: string
}
const props = withDefaults(defineProps<IProps>(), {
  show: false,
  zIndex: 1000,
  confirmText: '确定',
  cancelText: '取消',
  alert: false,
  title: '',
  maxHeight: '70vh',
  // 使用內置的 scroll-view 來實現內容高度可變動
  innerScroll: false,
  autoClose: true,
  topBtnWidth: '100rpx',
})

const emit = defineEmits<{
  (e: 'hide'): void
  (e: 'cancel'): void
  (e: 'confirm'): void
  (e: 'update:show', show: boolean): void
}>()

const onClose = () => {
  emit('hide')
  emit('update:show', false)
}
const onCancel = () => {
  emit('cancel')
  if (props.autoClose) {
    onClose()
  }
}

const onConfirm = () => {
  emit('confirm')
  if (props.autoClose && props.alert) {
    onClose()
  }
}

const preventHandler = (e: TouchEvent) => {}
</script>

<style lang="scss" scoped>
.left-btn {
  padding-left: 20rrpx;
}
.right-btn {
  padding-right: 20rrpx;
}
</style>
