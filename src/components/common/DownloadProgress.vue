<template>
  <view v-if="visible" class="download-progress">
    <view class="progress-content">
      <view class="progress-header">
        <text class="title">应用更新</text>
        <text class="version">版本: {{ version }}</text>
      </view>
      <view class="progress-bar">
        <view class="progress-inner" :style="{ width: progress + '%' }"></view>
      </view>
      <view class="progress-info">
        <text class="progress-text">{{ progress }}%</text>
        <text class="size-text">{{ formatSize(currentSize) }}/{{ formatSize(totalSize) }}</text>
      </view>
      <view class="progress-status">{{ statusText }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = defineProps<{
  visible: boolean
  version: string
  progress: number
  currentSize: number
  totalSize: number
  status: 'downloading' | 'installing' | 'success' | 'error'
}>()

const statusText = computed(() => {
  switch (props.status) {
    case 'downloading':
      return '正在下载更新...'
    case 'installing':
      return '正在安装更新...'
    case 'success':
      return '更新成功！'
    case 'error':
      return '更新失败'
    default:
      return ''
  }
})

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style lang="scss" scoped>
.download-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600rrpx;
  background-color: #fff;
  border-radius: 16rrpx;
  box-shadow: 0 4rrpx 24rrpx rgba(0, 0, 0, 0.1);
  z-index: 999999999;
  padding: 30rrpx;
}

.progress-content {
  display: flex;
  flex-direction: column;
  gap: 20rrpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 32rrpx;
    font-weight: bold;
    color: #333;
  }

  .version {
    font-size: 24rrpx;
    color: #666;
  }
}

.progress-bar {
  height: 8rrpx;
  background-color: #f0f0f0;
  border-radius: 4rrpx;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background-color: #2979ff;
  border-radius: 4rrpx;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .progress-text {
    font-size: 28rrpx;
    color: #2979ff;
    font-weight: bold;
  }

  .size-text {
    font-size: 24rrpx;
    color: #999;
  }
}

.progress-status {
  text-align: center;
  font-size: 26rrpx;
  color: #666;
}
</style>
