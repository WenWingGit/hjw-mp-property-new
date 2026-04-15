<template>
  <view class="pagination">
    <view
      v-for="page in total"
      :key="page"
      class="page-btn"
      :class="{ active: page === current }"
      @click="handlePageClick(page)"
    >
      {{ page }}
    </view>
  </view>
</template>

<script lang="ts" setup>
interface Props {
  current: number
  total: number
}

interface Emits {
  (e: 'change', page: number): void
}

const props = withDefaults(defineProps<Props>(), {
  current: 1,
  total: 1,
})

const emit = defineEmits<Emits>()

const handlePageClick = (page: number) => {
  if (page === props.current) return
  emit('change', page)
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12rpx;
}

.page-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18rpx;
  color: #666;
  background: #f5f5f5;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #3d43c3;
    color: #3d43c3;
    background: #ffffff;
  }

  &.active {
    background: #3d43c3;
    color: #ffffff;
    border-color: #3d43c3;
    font-weight: bold;
  }
}
</style>
