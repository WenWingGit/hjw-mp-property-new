import { useLoginStore } from '@/store'
import { isValidUrl } from './utils'
import { AccessTokenCacheKey } from '@/store/storeName'
import { getCache } from './storage'
import { getNeedLoginPages } from '.'
import { UniOnEvents } from '@/maps/uniEvents'

/**
 * 显示loading
 * @param title 标题，默认"加载中"
 * @param mask 是否显示遮罩，默认"true"
 * @example
 * // 基本用法
 * $showLoading()
 *
 * // 自定义标题
 * $showLoading('正在加载...')
 *
 * // 完整配置
 * $showLoading('处理中...', false)
 *
 */
export function $showLoading(title = '加载中', mask = true) {
  return new Promise((resolve: (value: void) => void) => {
    uni.showLoading({
      title,
      mask,
      complete: () => {
        resolve()
      },
    })
  })
}

/**
 * 隐藏loading
 */
export function $hideLoading() {
  uni.hideLoading()
}

/**
 * 显示提示
 * @param title 提示内容
 * @param options 配置选项
 * @param options.icon 图标类型 success | error | none | loading
 * @param options.duration 显示时长,默认1500ms
 * @param options.mask 是否显示遮罩
 * @param options.position 显示位置 top | center | bottom
 * @returns Promise 返回Promise用于链式调用
 *
 * @example
 * $tips('提示内容')
 *
 * $tips('提示内容', {
 *   icon: 'success',
 *   duration: 1500,
 *   mask: true,
 *   position: 'center',
 * })
 */
export function $tips(
  title: string,
  options?: {
    icon?: 'success' | 'error' | 'none' | 'loading'
    duration?: number
    mask?: boolean
    position?: 'top' | 'center' | 'bottom'
  },
): Promise<void> {
  const defaultOptions = {
    icon: 'none',
    duration: 1500,
    mask: false,
    position: 'center',
  }
  const mergedOptions = { ...defaultOptions, ...options }

  return new Promise((resolve) => {
    uni.showToast({
      title,
      icon: mergedOptions.icon as any,
      duration: mergedOptions.duration,
      mask: mergedOptions.mask,
      position: mergedOptions.position as any,
      success: () => {
        setTimeout(resolve, mergedOptions.duration)
      },
    })
  })
}

/** 确认框选项 */
type IConfirmOptions = Partial<UniApp.ShowModalOptions>

/**
 * @description 显示确认框
 * @param {String} content 内容
 * @param {String} title 标题 默認為‘提示’
 * @param {Object} opt 剩余参数
 * @returns {Promise<Boolean>} 用户选择结果
 */
export function $confirm(content: string = '', title: string = '提示', opt: IConfirmOptions = {}) {
  return new Promise((resolve) => {
    const params = {
      title,
      content,
      confirmText: '确定',
      cancelText: '取消',
      ...opt,
    }
    uni.showModal({
      ...params,
      success: (res) => {
        resolve(res)
      },
    })
  })
}

/**
 * 弹出提示对话框
 * @param {String} content 内容
 * @param {?String} title 标题
 * @param {?String} confirmText 确认按钮文字
 * @return {undefined}
 */
export function $alert(content: string = '', title = '提示', confirmText = '确定') {
  return new Promise((resolve: (value: void) => void) => {
    wx.showModal({
      title,
      content,
      confirmText,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          resolve()
        }
      },
    })
  })
}

/**
 * 复制文本
 * @param text 文本
 */
export function $copy(text: string, isShowTips = true) {
  return new Promise((resolve) => {
    uni.setClipboardData({
      data: text,
      success: () => {
        if (isShowTips) {
          $tips('已复制')
        }
        resolve(true)
      },
    })
  })
}

/**
 * 打开webview
 * @param url 链接
 * @param title 标题
 * @returns 返回Promise用于链式调用
 *
 * @example
 * $openWebView('https://www.baidu.com')
 *
 * $openWebView('https://www.baidu.com', '百度')
 */
export function $openWebView(url: string, title?: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (url.includes('小程序')) {
      $copy(url, false).then(() => {
        $tips('小程序链接无法直接打开，已复制，请手动打开')
      })
      return resolve(false)
    }
    if (!isValidUrl(url)) {
      $tips('无效的URL地址')
      return resolve(false)
    }

    uni.navigateTo({
      url: `/pages/common/webView?url=${encodeURIComponent(url)}&title=${title}`,
      fail: (err) => {
        console.error('打开webview失败:', err)
        $tips('打开页面失败')
        resolve(false)
      },
      success: () => {
        resolve(true)
      },
    })
  })
}

/** 获取图片信息 */
type IGetImageInfoOptions = Partial<UniApp.GetImageInfoOptions>

/** 获取图片信息返回数据 */
type IGetImageInfoSuccessData = UniApp.GetImageInfoSuccessData

/**
 * 获取图片信息
 * @param src 图片链接
 * @returns Promise 返回Promise用于链式调用
 */
export function $getImageInfo(
  src: string,
  opt: IGetImageInfoOptions = {},
): Promise<IGetImageInfoSuccessData> {
  if (!src) return Promise.resolve(null)
  return new Promise((resolve) => {
    uni.getImageInfo({
      src,
      ...opt,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        console.log(err)
        resolve(null)
      },
    })
  })
}

/**
 * 获取DOM元素的尺寸信息
 * @param selector 元素选择器（类名、ID等），如 '.class-name' 或 '#id-name'
 * @param componentInstance 组件实例，用于指定查询的作用域，可选
 * @returns Promise<UniApp.NodeInfo | null> 返回元素的尺寸信息，包含 width、height、top、left、right、bottom 等属性，元素不存在时返回 null
 *
 * @example
 * // 基本用法
 * const rect = await $getDomRect('.my-element')
 * console.log(rect?.width, rect?.height)
 *
 * // 在组件中使用，指定组件实例
 * const rect = await $getDomRect('.my-element', this)
 * if (rect) {
 *   console.log('元素宽度:', rect.width)
 *   console.log('元素高度:', rect.height)
 * }
 */
export function $getDomRect(
  selector: string,
  componentInstance?: any,
): Promise<UniApp.NodeInfo | null> {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery()
    const queryInstance = componentInstance ? query.in(componentInstance) : query

    queryInstance
      .select(selector)
      .boundingClientRect((data) => {
        if (Array.isArray(data) && data.length > 0) {
          resolve(data[0])
        } else if (data) {
          resolve(data)
        } else {
          resolve(null)
        }
      })
      .exec()
  })
}

/** 检查是否登录 */
export const checkLogin = (): boolean => {
  const isLogin = getCache(AccessTokenCacheKey) || ''
  return isLogin
}

/** 跳转页面 */
export function $nav(url: string) {
  const isLogin = checkLogin()
  const needLoginPages = getNeedLoginPages()
  const isNeedLogin = needLoginPages.some((page) => url.indexOf(page) !== -1)
  if (!isLogin && isNeedLogin) {
    uni.$emit(UniOnEvents.NO_LOGIN, url)
    return
  }

  return new Promise((resolve) => {
    uni.navigateTo({
      url,
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      },
    })
  })
}

/** 跳转页面 */
export function $tab(url: string) {
  const isLogin = checkLogin()
  const needLoginPages = getNeedLoginPages()
  if (!isLogin && needLoginPages.includes(url)) {
    uni.$emit(UniOnEvents.NO_LOGIN, url)
    return
  }

  return new Promise((resolve) => {
    uni.switchTab({
      url,
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      },
    })
  })
}

/** 重新启动页面 */
export function $reNavAll(url: string) {
  const isLogin = checkLogin()
  const needLoginPages = getNeedLoginPages()
  if (!isLogin && needLoginPages.includes(url)) {
    uni.$emit(UniOnEvents.NO_LOGIN, url)
    return
  }

  return new Promise((resolve) => {
    uni.reLaunch({
      url,
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      },
    })
  })
}

/** 重定向页面 */
export function $reNav(url: string) {
  const isLogin = checkLogin()
  const needLoginPages = getNeedLoginPages()
  if (!isLogin && needLoginPages.includes(url)) {
    uni.$emit(UniOnEvents.NO_LOGIN, url)
    return
  }

  return new Promise((resolve) => {
    uni.redirectTo({
      url,
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      },
    })
  })
}

/** 关闭当前页面 */
export function $navBack() {
  return new Promise((resolve) => {
    uni.navigateBack({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      },
    })
  })
}

export function $loginSync(): Promise<string> {
  return new Promise((resolve) => {
    uni.login({
      success: (res) => {
        resolve(res?.code)
      },
    })
  })
}
