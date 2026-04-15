<template>
  <view>
    <view
      v-for="(item, index) in props.fileList"
      :key="item.id"
      class="sx-p-10 box-border border-line-bottom"
    >
      <view class="flex w-full items-center">
        <view class="flex-1 overflow-hidden sx-mr-12 sx-fz-14 color-gray-8">
          <view>{{ item.fileName || '文件' + (index + 1) }}</view>
          <!-- {{ item.oriFileName }} -->
        </view>
        <view class="flex">
          <view
            v-if="props.showDelete"
            class="sx-fz-14 color-gray-6 sx-p-5"
            @click="onDelete(item)"
          >
            删除
          </view>
          <view
            v-if="props.showDownload"
            class="sx-fz-14 color-gray-6 sx-p-5"
            @click="onDownload(item.filePath)"
          >
            下载
          </view>
          <view class="sx-fz-14 color-gray-6 sx-p-5" @click="openFile(item.filePath)">查看</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { $hideLoading, $showLoading } from '@/utils/common'
import { fullUrl, openFile } from '@/utils/utils'

interface IProps {
  fileList: any[]
  showDelete?: boolean
  showDownload?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  fileList: () => [],
  showDelete: false,
  showDownload: false,
})

const emit = defineEmits(['delete', 'download'])

const onDelete = (item) => {
  emit('delete', item)
}
const onDownload = (filePath: string) => {
  $showLoading('下载中...')
  const fileUrl = fullUrl(filePath)
  uni.downloadFile({
    url: fileUrl,
    success: (res) => {
      $hideLoading()
      uni.showToast({
        title: '下载成功',
        icon: 'none',
      })
      emit('download', res)
    },
    fail: () => {
      $hideLoading()
      uni.showToast({
        title: '下载失败',
        icon: 'none',
      })
    },
  })
}
</script>

<style lang="scss" scoped>
//
</style>
