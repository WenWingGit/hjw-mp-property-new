<template>
  <view class="nav-top-bar-wrapper">
    <!-- 固定定位的导航栏 -->
    <view
      class="nav-bar"
      :style="{
        padding: `${navStyle.top} 0 ${paddingBottom}`,
        '--nav-bar-height': navStyle.height,
        background: placeHolder ? 'transparent' : isOver ? scrollBgColor : bgColor,
        transition: 'background-color 0.3s',
      }"
    >
      <view class="nav-bar-content" :style="{ height: navStyle.height }">
        <view class="nav-bar-buttons">
          <!-- 返回按钮 -->
          <view
            v-if="showBack"
            class="nav-bar-btn back-btn"
            :style="{
              background: iconBgColor,
              borderColor: btnBorderColor,
            }"
            @click="handleBack"
          >
            <AppIcon :size="iconBackFz" :color="iconColor" icon="icon-arrow_left" />
          </view>

          <!-- 主页按钮 -->
          <view
            v-if="showHome"
            class="nav-bar-btn home-btn"
            :style="{
              background: iconBgColor,
              borderColor: btnBorderColor,
            }"
            @click="handleHome"
          >
            <AppIcon :size="iconHomeFz" :color="iconColor" icon="icon-shouye1" />
            <text class="home-text" :style="{ color: iconColor }">主页</text>
          </view>

          <!-- 搜索按钮（完整样式） -->
          <view
            v-if="isShowSearch"
            class="search-btn"
            :style="{
              borderRadius: `${navStyle.height}px`,
              width: searchWidth,
              borderColor: btnBorderColor,
            }"
            @click="handleSearch"
          >
            <AppIcon :size="iconSearchFz" :color="iconColor" icon="icon-search" />
            <text class="search-btn-tips">{{ searchPlaceholder }}</text>
          </view>

          <!-- 搜索按钮（迷你样式） -->
          <view
            v-if="isShowMinSearch"
            class="search-btn min-search"
            :class="searchTheme"
            :style="{
              width: `${navStyle.height}px`,
              borderRadius: `${navStyle.height}px`,
              borderColor: btnBorderColor,
            }"
            @click="handleSearch"
          >
            <image
              v-if="searchTheme === 'gray'"
              class="search-icon-img"
              src="/static/images/common/icon_search_gray.png"
            />
            <image
              v-if="searchTheme === 'white'"
              class="search-icon-img"
              src="/static/images/common/icon_search_white.png"
            />
          </view>

          <!-- 插槽内容 -->
          <view
            class="nav-bar-slot"
            :style="{
              paddingRight: isShowPaddingRight ? `calc(${navStyle.paddingRight} - 30rpx)` : '0',
            }"
          >
            <slot></slot>
          </view>
        </view>
      </view>

      <!-- 标题 -->
      <view
        class="nav-bar-title"
        :style="{
          top: navStyle.top,
          height: navStyle.height,
          color: titleColor,
          fontSize: titleFz,
          fontWeight: titleWeight,
        }"
      >
        <view class="title-text" :style="{ width: titleWidth }">
          {{ scrollTop > scrollY ? scrollTitle || title : title }}
        </view>
      </view>

      <!-- 背景层（让滚动后顶部背景颜色过渡更加自然） -->
      <view
        class="nav-bar-bg-base"
        :style="{
          height: navStyle.totalHeight,
          background: bgColor,
        }"
      ></view>
      <view
        v-if="navBarHeight > 0"
        class="nav-bar-bg-scroll"
        :style="{
          height: navStyle.totalHeight,
          background: scrollBgColor,
          opacity: scrollOpacity,
          transition: 'opacity 0.5s',
        }"
      ></view>
    </view>

    <!-- 占位符 -->
    <view
      v-if="placeHolder"
      class="nav-bar-placeholder"
      :style="{
        height: navStyle.totalHeight,
        background: bgColor,
        transition: 'background-color 0.3s',
      }"
    ></view>
    <view id="offset-top" class="offset-top"></view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from '@/components/common/AppIcon/AppIcon.vue'

// Props 定义
interface Props {
  // 内边距底部
  pb?: string
  // 背景颜色
  bgColor?: string
  // 滚动后标题
  scrollTitle?: string
  // 滚动一定位置变色
  scrollBgColor?: string
  // 滚动多少位置
  scrollY?: number
  // 标题
  title?: string
  titleFz?: string
  titleWidth?: string
  titleWeight?: string
  titleColor?: string
  // 胶囊主题
  btnTheme?: 'white' | 'black' | ''
  iconBackFz?: string
  iconHomeFz?: string
  iconSearchFz?: string
  iconColor?: string
  iconBgColor?: string
  searchUrl?: string
  placeHolder?: boolean
  searchWidth?: string
  searchPlaceholder?: string
  isShowBack?: boolean
  isShowHome?: boolean
  isShowSearch?: boolean
  isShowMinSearch?: boolean
  searchTheme?: 'gray' | 'white'
  isShowPaddingRight?: boolean
  // 自定义高度
  navHeight?: number | string
  // 是否启用滚动监听
  enableScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pb: 'var(--nav-bar-padding-bottom, 6px)',
  bgColor: 'var(--nav-bg-color, transparent)',
  scrollBgColor: 'var(--nav-scroll-bg-color, #ffffff)',
  scrollY: 120,
  titleFz: 'var(--nav-bar-title-font-size, 30rpx)',
  titleWidth: '100%',
  titleWeight: 'normal',
  titleColor: 'var(--nav-bar-title-color, #ffffff)',
  btnTheme: '',
  iconBackFz: 'var(--nav-bar-icon-back-size, 42rpx)',
  iconHomeFz: 'var(--nav-bar-icon-home-size, 36rpx)',
  iconSearchFz: 'var(--nav-bar-icon-search-size, 36rpx)',
  placeHolder: true,
  searchWidth: '230rpx',
  searchPlaceholder: '搜索',
  isShowBack: true,
  isShowHome: true,
  isShowSearch: false,
  isShowMinSearch: false,
  searchTheme: 'gray',
  isShowPaddingRight: false,
  navHeight: '',
  enableScroll: false,
})

// Emits 定义
const emit = defineEmits<{
  back: []
  home: []
  search: []
  loaded: [data: NavStyleData]
  isOver: [isOver: boolean]
}>()

// 导航栏样式数据接口
interface NavStyleData {
  width: string
  height: string
  top: string
  paddingRight: string
  totalHeight: string
  _width: number
  _height: number
  _top: number
}

// 导航栏样式
const navStyle = ref<NavStyleData>({
  width: '0px',
  height: '0px',
  top: '0px',
  paddingRight: '0px',
  totalHeight: '0px',
  _width: 0,
  _height: 0,
  _top: 0,
})

// 滚动位置
const scrollTop = ref(0)
// 是否超过滚动阈值
const isOver = ref(false)
// 导航栏高度（用于计算透明度）
const navBarHeight = ref(0)

// 计算图标颜色
const iconColor = computed(() => {
  if (props.iconColor) return props.iconColor
  if (props.btnTheme === 'white') {
    return 'var(--nav-bar-icon-color, #ffffff)'
  } else if (props.btnTheme === 'black') {
    return '#1a1a1a'
  }
  return 'var(--nav-bar-icon-color, #ffffff)'
})

// 计算图标背景颜色
const iconBgColor = computed(() => {
  if (props.iconBgColor) return props.iconBgColor
  if (props.btnTheme === 'white') {
    return 'var(--nav-bar-icon-bg-color, rgba(255,255,255,.2))'
  } else if (props.btnTheme === 'black') {
    return '#f0f3f9'
  }
  return 'var(--nav-bar-icon-bg-color, rgba(255,255,255,.2))'
})

// 计算按钮边框颜色
const btnBorderColor = computed(() => {
  if (props.btnTheme === 'black') {
    return '#f0f3f9'
  }
  return 'var(--nav-bar-btn-border-color, rgba(255,255,255,.2))'
})

// 计算内边距底部
const paddingBottom = computed(() => {
  return props.pb
})

// 计算滚动透明度
const scrollOpacity = computed(() => {
  if (navBarHeight.value <= 0) return 0
  const opacity = scrollTop.value / (navBarHeight.value * 2)
  return opacity < 0.4 ? 0 : opacity
})

// 显示返回按钮（根据页面栈判断）
const showBack = computed(() => {
  if (!props.isShowBack) return false
  const pages = getCurrentPages()
  return pages.length > 1
})

// 显示主页按钮（根据当前路径判断）
const showHome = computed(() => {
  if (!props.isShowHome) return false
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const currentPath = '/' + (currentPage?.route || '')
  // 假设首页路径，需要根据实际情况调整
  const homePath = '/pages/index/index'
  return currentPath !== homePath
})

// 初始化导航栏
const initNavBar = () => {
  // #ifdef MP-WEIXIN
  // 获取胶囊按钮位置信息
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
  const wxSystemInfo = uni.getSystemInfoSync()
  const screenWidth = wxSystemInfo.screenWidth

  const width = menuButtonInfo.width + 'px'
  const height = props.navHeight || menuButtonInfo.height + 'px'
  const top = menuButtonInfo.top + 'px'
  const paddingRight = screenWidth - menuButtonInfo.left + 'px'
  const totalHeight = `calc(${top} + ${height} + ${props.pb})`

  const navStyleData: NavStyleData = {
    width,
    height,
    top,
    paddingRight,
    totalHeight,
    _width: menuButtonInfo.width,
    _height: props.navHeight ? Number(props.navHeight) : menuButtonInfo.height,
    _top: menuButtonInfo.top,
  }

  navStyle.value = navStyleData
  emit('loaded', navStyleData)
  // #endif

  // #ifndef MP-WEIXIN
  // 非微信小程序环境，使用默认值
  const defaultSystemInfo = uni.getSystemInfoSync()
  const statusBarHeight = defaultSystemInfo.statusBarHeight || 0
  const defaultHeight = 44 // 默认导航栏高度

  navStyle.value = {
    width: '0px',
    height: `${defaultHeight}px`,
    top: `${statusBarHeight}px`,
    paddingRight: '0px',
    totalHeight: `${statusBarHeight + defaultHeight}px`,
    _width: 0,
    _height: defaultHeight,
    _top: statusBarHeight,
  }
  // #endif

  // 获取导航栏高度（用于计算透明度）
  setTimeout(() => {
    const query = uni.createSelectorQuery()
    query
      .select('#offset-top')
      .boundingClientRect((data: any) => {
        if (data) {
          navBarHeight.value = data.top || 0
        }
      })
      .exec()
  }, 100)
}

// 处理返回
const handleBack = () => {
  emit('back')
  uni.navigateBack({
    delta: 1,
    fail: () => {
      uni.switchTab({
        url: '/pages/index/index',
      })
    },
  })
}

// 处理主页
const handleHome = () => {
  emit('home')
  uni.reLaunch({
    url: '/pages/index/index',
  })
}

// 处理搜索
const handleSearch = () => {
  emit('search')
  if (props.searchUrl) {
    uni.navigateTo({
      url: props.searchUrl,
    })
  }
}

// 处理页面滚动
const handlePageScroll = (e: any) => {
  if (!props.enableScroll) return
  const scrollTopValue = e.scrollTop || 0
  scrollTop.value = scrollTopValue
  const isOverValue = scrollTopValue > props.scrollY
  isOver.value = isOverValue
  emit('isOver', isOverValue)
}

onMounted(() => {
  initNavBar()
  if (props.enableScroll) {
    uni.$on('onPageScroll', handlePageScroll)
  }
})

onBeforeUnmount(() => {
  if (props.enableScroll) {
    uni.$off('onPageScroll', handlePageScroll)
  }
})
</script>

<style lang="scss" scoped>
.nav-top-bar-wrapper {
  position: relative;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  --nav-bar-height: 0px;
  --nav-bar-title-color: #fff;
  --nav-bar-title-font-size: 30rpx;
  --nav-bar-icon-color: #fff;
  --nav-bar-icon-back-size: 42rpx;
  --nav-bar-icon-home-size: 36rpx;
  --nav-bar-icon-search-size: 36rpx;
  --nav-bar-icon-bg-color: rgba(255, 255, 255, 0.2);
  --nav-bar-btn-border-color: rgba(255, 255, 255, 0.2);
}

.nav-bar-content {
  width: 100%;
  height: var(--nav-bar-height);
}

.nav-bar-buttons {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 30rpx;
}

.nav-bar-btn {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--nav-bar-height);
  margin-right: 19rpx;
  border: 2rpx solid transparent;
  border-radius: var(--nav-bar-height);
}

.back-btn {
  min-width: var(--nav-bar-height);
}

.home-btn {
  gap: 10rpx;
  min-width: 145rpx;
  font-size: 24rpx;
}

.home-text {
  font-size: 24rpx;
}

.search-btn {
  position: relative;
  z-index: 3;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: var(--nav-bar-height);
  padding-left: 28rpx;
  font-size: 28rpx;
  background-color: rgba(255, 255, 255, 1);
  border: 2rpx solid transparent;
  border-radius: 60rpx;
}

.search-btn.min-search {
  justify-content: center;
  padding-left: 0;
}

.search-btn.white {
  background-color: rgba(255, 255, 255, 0.4);
}

.search-icon-img {
  width: 26rpx;
  height: 26rpx;
}

.search-btn-tips {
  padding-left: 18rpx;
  color: var(--page-font-color, #333333);
}

.nav-bar-slot {
  z-index: 999999;
  flex: 1;
  width: 100%;
}

.nav-bar-title {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  line-height: 1;
  text-align: center;
}

.title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-bar-bg-base {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
}

.nav-bar-bg-scroll {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
}

.nav-bar-placeholder {
  width: 100%;
}

.offset-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 1rpx;
  height: 1rpx;
  visibility: hidden;
}
</style>
