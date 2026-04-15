<template>
  <view class="full-date-bar flex-gap-2">
    <view class="full-date hide-parent">
      <view v-if="date === ''" class="color-999">请选择</view>
      <view v-else>{{ fmtDate }}</view>
      <wd-datetime-picker type="date" :modelValue="date" @confirm="updateDate" />
    </view>

    <view class="full-time hide-parent">
      <view v-if="time === ''" class="color-999">请选择</view>
      <view v-else>{{ time }}</view>
      <wd-datetime-picker type="time" :modelValue="time" @confirm="updateTime" />
    </view>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { withDefaults } from 'vue'
interface IProps {
  date: string | number
  time: string | number
}
const props = withDefaults(defineProps<IProps>(), {
  date: '',
  time: '',
})
const fmtDate = computed(() => {
  if (!props.date) return ''
  return dayjs(+props.date).format('YYYY-MM-DD')
})

const emit = defineEmits<{
  (e: 'update:date', val: string): void
  (e: 'update:time', val: string): void
  (e: 'changeDate', val: string): void
  (e: 'changeTime', val: string): void
}>()

const updateDate = ({ value }: { value: string }) => {
  const date = dayjs(value).format('YYYY-MM-DD')
  emit('update:date', '' + value)
  emit('changeDate', date)
}
const updateTime = ({ value }: { value: string }) => {
  emit('update:time', value)
  emit('changeTime', value)
}
</script>

<style lang="scss" scoped>
.full-date-bar {
  display: flex;
  margin-bottom: 20rrpx;
}
.full-date {
  flex: 1;
}
.full-date,
.full-time {
  background-color: #f7f7f7;
  height: 100rrpx;
  padding: 18rrpx 28rrpx;
  box-sizing: border-box;
  border-radius: 20rrpx;
  display: flex;
  align-items: center;
}

.full-time {
  width: 174rrpx;
}

:deep(.wd-picker__field) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
