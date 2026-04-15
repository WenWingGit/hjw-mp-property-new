<template>
  <!-- 阻止页面滚动 -->
  <view id="page-nav-bar" @touchmove.stop.prevent="">
    <view
      class="page-nav-bar-wrapper"
      :class="[`theme-${theme}`, { 'is-scrolling': isScrolling }]"
      :style="{
        height: navBarHeight + 'px',
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        '--nav-bg-color': computedBgColor,
        '--nav-title-color': currentTheme.titleColor,
        '--nav-icon-color': currentTheme.iconColor,
        '--nav-opacity': scrollOpacity,
      }"
    >
      <!-- 状态栏占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

      <!-- 导航栏主体 -->
      <view class="nav-content" :style="{ height: contentHeight + 'px' }">
        <view class="left-slot">
          <slot name="back-left"></slot>
          <view v-if="showBack" class="back-btn" @click="handleBack">
            <AppIcon icon="icon-arrow_left" size="50rpx" />
          </view>
          <slot name="left"></slot>
        </view>

        <view class="center-slot">
          <slot name="center">
            <text class="title" v-if="title" @click="handleTitleClick">
              {{ title }}
            </text>
          </slot>
        </view>

        <view class="right-slot">
          <slot name="right"></slot>
        </view>
      </view>
    </view>

    <view v-if="placeholder" class="nav-placeholder" :style="{ height: navBarHeight + 'px' }" />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

type ThemeType = 'default' | 'transparent' | 'dark' | 'primary' | 'custom'

// 主题配置
const themes = {
  default: {
    backgroundColor: '#ffffff',
    scrollBackgroundColor: '#ffffff',
    titleColor: '#333333',
    iconColor: '#333333',
  },
  transparent: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    scrollBackgroundColor: '#ffffff',
    titleColor: '#ffffff',
    iconColor: '#ffffff',
  },
  dark: {
    backgroundColor: '#000000',
    scrollBackgroundColor: '#000000',
    titleColor: '#ffffff',
    iconColor: '#ffffff',
  },
  primary: {
    backgroundColor: '#2979ff',
    scrollBackgroundColor: '#2979ff',
    titleColor: '#ffffff',
    iconColor: '#ffffff',
  },
} as const

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: Boolean,
    default: true,
  },
  theme: {
    type: String as () => ThemeType,
    default: 'default',
  },
  backgroundColor: {
    type: String,
    default: '',
  },
  scrollBackgroundColor: {
    type: String,
    default: '',
  },
  bgImage: {
    type: String,
    default: '',
  },
  scrollBgImage: {
    type: String,
    default: '',
  },
  titleColor: {
    type: String,
    default: '',
  },
  iconColor: {
    type: String,
    default: '',
  },
  scrollThreshold: {
    type: Number,
    default: 100,
  },
  enableScroll: {
    type: Boolean,
    default: false,
  },
  showBorder: {
    type: Boolean,
    default: true,
  },
  borderColor: {
    type: String,
    default: '#e5e5e5',
  },
  borderStyle: {
    type: String,
    default: 'solid',
  },
  borderWidth: {
    type: String,
    default: '1px',
  },
})

const emit = defineEmits(['back', 'titleClick'])

// 导航栏高度相关
const statusBarHeight = ref(0)
const contentHeight = ref(44)
const navBarHeight = ref(0)
const scrollTop = ref(0)

// 添加主题相关的计算属性
const currentTheme = computed(() => {
  const themeConfig = themes[props.theme as keyof typeof themes] || themes.default

  return {
    backgroundColor: props.backgroundColor || themeConfig.backgroundColor,
    scrollBackgroundColor: props.scrollBackgroundColor || themeConfig.scrollBackgroundColor,
    titleColor: props.titleColor || themeConfig.titleColor,
    iconColor: props.iconColor || themeConfig.iconColor,
  }
})

// 计算背景色透明度
const computedBgColor = computed(() => {
  if (!props.enableScroll) return currentTheme.value.backgroundColor

  const alpha = Math.min(scrollTop.value / props.scrollThreshold, 1)
  const startColor = hexToRgb(currentTheme.value.backgroundColor)
  const endColor = hexToRgb(currentTheme.value.scrollBackgroundColor)

  if (!startColor || !endColor) return currentTheme.value.backgroundColor

  const r = Math.round(startColor.r + (endColor.r - startColor.r) * alpha)
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * alpha)
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * alpha)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
})

// 处理页面滚动
const handlePageScroll = (e: any) => {
  if (props.enableScroll) {
    scrollTop.value = e.scrollTop
  }
}

onMounted(() => {
  // 获取状态栏高度
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
  navBarHeight.value = statusBarHeight.value + contentHeight.value

  // 监听页面滚动
  if (props.enableScroll) {
    uni.$on('onPageScroll', handlePageScroll)
  }
})

onBeforeUnmount(() => {
  if (props.enableScroll) {
    uni.$off('onPageScroll', handlePageScroll)
  }
})

// 返回按钮处理
const handleBack = () => {
  emit('back')
  uni.navigateBack({
    delta: 1,
    fail() {
      uni.switchTab({
        url: import.meta.env.VITE_APP_HOME_PAGE,
      })
    },
  })
}

// 标题点击处理
const handleTitleClick = () => {
  emit('titleClick')
}

// 辅助函数：将16进制颜色转换为RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// 添加是否正在滚动的状态
const isScrolling = computed(() => scrollTop.value > 0)

// 计算滚动透明度
const scrollOpacity = computed(() => {
  if (!props.enableScroll) return 1
  return Math.min(scrollTop.value / props.scrollThreshold, 1)
})
</script>

<style lang="scss" scoped>
:root {
  // 默认主题变量
  --nav-bg-default: #ffffff;
  --nav-title-default: var(--page-title-color);
  --nav-icon-default: var(--page-title-color);

  // 透明主题变量
  --nav-bg-transparent: rgba(255, 255, 255, 0);
  --nav-title-transparent: #ffffff;
  --nav-icon-transparent: #ffffff;

  // 深色主题变量
  --nav-bg-dark: #000000;
  --nav-title-dark: #ffffff;
  --nav-icon-dark: #ffffff;

  // 主题色变量
  --nav-bg-primary: var(--primary-color);
  --nav-title-primary: #ffffff;
  --nav-icon-primary: #ffffff;
  --nav-bar-padding-bottom: 6px;
}

.page-nav-bar-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
  background-color: var(--nav-bg-color);
  background-position: center;
  background-size: cover;
  transition: background-color 0.3s;

  // 主题类
  &.theme-default {
    --nav-bg-color: var(--nav-bg-default);
    --nav-title-color: var(--nav-title-default);
    --nav-icon-color: var(--nav-icon-default);
  }

  &.theme-transparent {
    --nav-bg-color: var(--nav-bg-transparent);
    --nav-title-color: var(--nav-title-transparent);
    --nav-icon-color: var(--nav-icon-transparent);

    &.is-scrolling {
      --nav-bg-color: var(--nav-bg-default);
      --nav-title-color: var(--nav-title-default);
      --nav-icon-color: var(--nav-icon-default);
    }
  }

  &.theme-dark {
    --nav-bg-color: var(--nav-bg-dark);
    --nav-title-color: var(--nav-title-dark);
    --nav-icon-color: var(--nav-icon-dark);
  }

  &.theme-primary {
    --nav-bg-color: var(--nav-bg-primary);
    --nav-title-color: var(--nav-title-primary);
    --nav-icon-color: var(--nav-icon-primary);
  }

  .nav-content {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 20rrpx;

    .left-slot {
      display: flex;
      flex: 1;
      align-items: center;

      .back-btn {
        padding: 6rpx;

        :deep(.app-icon) {
          color: var(--nav-icon-color);
        }
      }
    }

    .center-slot {
      display: flex;
      flex: 2;
      align-items: center;
      justify-content: center;

      .title {
        font-size: 32rpx;
        font-weight: 500;
        color: var(--nav-title-color);
        transition: color 0.3s;

        &:active {
          opacity: 0.7;
        }
      }
    }

    .right-slot {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      :deep(.app-icon) {
        color: var(--nav-icon-color);
      }
    }
  }

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: v-bind('props.showBorder ? "block" : "none"');
    height: v-bind('props.borderWidth');
    content: '';
    background-color: v-bind('props.borderColor');
    transform: scaleY(0.5);
  }
}

.nav-placeholder {
  width: 100%;
}
</style>
