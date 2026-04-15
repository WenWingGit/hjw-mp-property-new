<template>
  <view class="flex-row items-center section_20 page-tag" :class="[props.type]" @click="onClickTag">
    <view>{{ props.name }}</view>
    <image
      v-if="closeabled"
      class="image_12"
      @click.capture.stop="onClickTagClose"
      mode="widthFix"
      src="/static/images/icon_close.png"
    />
  </view>
</template>

<script lang="ts" setup>
interface IProps {
  name: string
  type?: string
  item?: any
  closeabled?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  name: '',
  item: () => {},
  // 是否显示关闭按钮
  closeabled: false,
})

const emit = defineEmits<{
  (e: 'click', item): void
  (e: 'close', item): void
}>()
const onClickTag = () => {
  emit('click', props.item)
}
const onClickTagClose = () => {
  emit('close', props.item)
}
</script>
<style lang="scss" scoped>
.section_20 {
  padding: 0 16rrpx;
  border-radius: 10rrpx;
  height: 58rrpx;
  font-size: 26rrpx;
  border: solid 2rrpx #efefef;
  &.primary {
    background-color: #f4f7ff;
    border: solid 2rrpx #c3d1f5;
    color: #253f86;
  }
  &.warning {
    background-color: #fff3cd;
    border: solid 2rrpx #ffeeba;
    color: #856404;
  }
}

.image_12 {
  margin-left: 20rrpx;
  width: 20rrpx;
  height: 20rrpx;
}
</style>
<style>
.page-tag + .page-tag {
  margin-left: 10rrpx;
}
</style>
