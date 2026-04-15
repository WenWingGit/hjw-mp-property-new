<template>
  <!-- <view>
    <view v-if="props.pageInfo?.totalRows" class="w-full">
      <view v-if="!props.pageInfo?.hasNextPage && props.pageInfo?.pageIndex !== 1" class="more">
        <view class="text">{{ noMoreText }}</view>
      </view>
    </view>
    <view v-else class="w-full">
      <Empty :text="emptyText" />
    </view>
  </view> -->

  <template v-if="props.params.isLoading && !props.isRefreshLoading">
    <Loading />
  </template>
  <template v-else>
    <NoMore v-if="!props.params.isEmpty && props.params.isNoMore" />
    <Empty v-if="props.params.isEmpty" />
  </template>
</template>

<script setup lang="ts">
import Empty from '@/components/common/Empty.vue'
import Loading from '@/components/common/Loading/Loading.vue'
import NoMore from '@/components/common/NoMore.vue'

const props = defineProps({
  params: {
    type: Object,
    default: () => {
      return {
        isLoading: false,
        isNoMore: false,
        isEmpty: false,
      }
    },
  },
  isRefreshLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.more {
  overflow: hidden;
  text-align: center;
  color: #999999;
}
.more .text {
  display: inline-block;
  padding: 20rrpx 0 40rrpx;
}
</style>
