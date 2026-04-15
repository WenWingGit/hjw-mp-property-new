<template>
  <view class="flex justify-between" :style="{ paddingTop: props.pt, paddingBottom: props.pb }">
    <view class="flex-1">
      <view
        class="sx-fz-18 font-bold title-com"
        :class="{ 'title-line': titleLine }"
        :style="{ fontSize: fontSize }"
      >
        <view class="inline-block align-middle sx-lh-1">
          {{ title }}
        </view>
        <view v-if="count !== ''" class="title-count align-middle">{{ count }}</view>
        <view class="inline-block sx-ml-8 align-middle">
          <slot name="title-right"></slot>
        </view>
      </view>
      <view v-if="desc" class="sx-mt-15 sx-fz-15 sx-color-999999">{{ desc }}</view>
    </view>
    <view class="fc">
      <view
        v-if="isMore"
        class="flex a-c sx-fz-14 sx-color-999999"
        @click.stop="handleMore(props.url)"
      >
        <view class="">{{ moreText }}</view>
        <AppIcon icon="icon-arrow_right" color="#999"></AppIcon>
      </view>
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title: string
    desc?: string
    count?: string | number
    isMore?: boolean
    titleLine?: boolean
    fontSize?: string
    moreText?: string
    url?: string
    pt?: string
    pb?: string
  }>(),
  {
    pt: '30rpx',
    pb: '30rpx',
    fontSize: '36rpx',
    moreText: '查看更多',
    titleLine: false,
    count: '',
    url: '',
  },
)

const handleMore = (url: string) => {
  if (url) {
    uni.navigateTo({
      url,
    })
  }
}
</script>

<style lang="scss" scoped>
.title-com {
  position: relative;
}

.title-line {
  padding-left: 20rrpx;
  &::after {
    position: absolute;
    display: block;
    content: '';
    width: 8rrpx;
    height: 28rrpx;
    background: var(--primary-color);
    border-radius: 4rrpx;
    top: 50%;
    margin-top: -14rrpx;
    left: 0;
  }
}

.title-count {
  margin-left: 10rrpx;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 45rrpx;
  padding: 0 10rrpx;
  height: 33rrpx;
  background: #e23d3d;
  color: #fff;
  font-size: 24rrpx;
  border-radius: 16rrpx 16rrpx 16rrpx 16rrpx;
}
</style>
