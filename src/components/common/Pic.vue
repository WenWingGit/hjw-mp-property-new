<template>
  <!-- <view style="display: none">{{ _src }}</view> -->
  <wd-img
    v-bind="$attrs"
    :src="_src"
    :mode="$attrs.mode ? $attrs.mode : 'widthFix'"
    :style="{ background: _src ? 'transparent' : '#e7eaf2', verticalAlign: 'middle' }"
    @error="handleError"
    v-if="!isError"
  >
    <template #error>
      <view
        class="w-full h-full flex items-center justify-center sx-fz-12 sx-color-999"
        style="background: #e7eaf2"
      >
        图片无法查看
      </view>
    </template>
  </wd-img>
</template>

<script lang="ts">
import PLATFORM from '@/utils/platform'

export default {
  inheritAttrs: false,
  data() {
    return {
      isError: false,
    }
  },
  computed: {
    _src() {
      try {
        const src = this.$attrs.src as string
        if (PLATFORM?.isApp) {
          if (src.indexOf('/src') > -1) {
            return src.split('/src')[1] as string
          } else {
            return src
          }
        } else if (PLATFORM?.isH5 && import.meta.env.VITE_NODE_ENV === 'production') {
          if (src.indexOf('http') > -1) {
            return src
          } else {
            return src.split('/src')[1] as string
          }
        }
        return src as string
      } catch (error) {
        console.log(error)
      }
      return '' as string
    },
  },
  methods: {
    handleError() {
      this.isError = true
    },
  },
}

// mode	填充模式	ImageMode	'top left' / 'top right' / 'bottom left' / 'bottom right' / 'right' / 'left' / 'center' / 'bottom' / 'top' / 'heightFix' / 'widthFix' / 'aspectFill' / 'aspectFit' / 'scaleToFill'
</script>

<style lang="scss" scoped></style>
