import { onMounted, ref, computed } from 'vue'

/** 计算类型 */
type ICalcType = 'height' | 'width' | 'top' | 'bottom' | 'left' | 'right'

/** 获取dom元素的尺寸的配置 */
interface IDomRectOptions {
  /** 额外的高度 */
  extraHeight?: string
  /** 计算类型 */
  calcType?: ICalcType
  /** 是否需要计算导航栏高度 */
  hasNavTopBarHeight?: boolean
  /** 导航栏选择器名称 */
  navTopBarQueryName?: string
}

/**
 * 根据传入的selectorQuery（样式选择器|id选择器）获取dom元素的尺寸
 * @param ids - 需要获取尺寸的dom元素的选择器
 * @param opts - 需要配置或者 获取尺寸的类型
 * @returns 返回dom元素的尺寸
 */
export function useDomRect(ids: string | string[], opts: ICalcType | IDomRectOptions = 'height') {
  const domRect = ref<any[]>([])
  let extraHeight = '0px'
  let calcType = opts
  let hasNavTopBarHeight = false
  // 有bug 需要在<NavTopBar>
  // 组件外层添加 #page-nav-bar-wrapper 选择器 才能正常使用
  let navTopBarQueryName = '#page-nav-bar-wrapper'
  if (typeof opts === 'object') {
    extraHeight = opts?.extraHeight || '0px'
    calcType = opts?.calcType || ('height' as ICalcType)
    hasNavTopBarHeight = opts?.hasNavTopBarHeight ?? true
    navTopBarQueryName = opts?.navTopBarQueryName || '#page-nav-bar-wrapper'
  } else if (typeof opts === 'string') {
    calcType = opts as ICalcType
  }
  onMounted(async () => {
    setTimeout(async () => {
      const query = uni.createSelectorQuery()
      if (Array.isArray(ids)) {
        if (hasNavTopBarHeight && ids.indexOf(navTopBarQueryName) === -1) {
          ids.push(navTopBarQueryName)
        }
        const promises = ids.map((item) => {
          return new Promise((resolve, reject) => {
            if (!item) {
              resolve(undefined)
              return
            }
            query
              .select(item)
              .boundingClientRect((data) => {
                if (Array.isArray(data) && data.length > 0) {
                  domRect.value.push(data[0] ?? '')
                } else {
                  // 找到里面是否已经存在
                  const index = Array.isArray(data)
                    ? domRect.value.findIndex((item) => item?.id === data[0]?.id)
                    : domRect.value.findIndex((item) => item?.id === data?.id)
                  if (index === -1) {
                    domRect.value.push(data ?? '')
                  } else {
                    domRect.value[index] = data
                  }
                }
                resolve(undefined)
              })
              .exec()
          })
        })

        await Promise.all(promises)
      } else {
        query
          .select(`${ids}`)
          .boundingClientRect((data) => {
            if (Array.isArray(data) && data.length > 0) {
              domRect.value.push(data[0] ?? '')
            } else {
              domRect.value.push(data ?? '')
            }
          })
          .exec()
      }
    }, 500)
  })

  // 计算所有dom元素的尺寸
  const allRect = ref('')

  watch(
    () => domRect.value,
    () => {
      console.log(domRect.value)
      if (!domRect.value) return ''
      if (domRect.value && domRect.value?.length === 0) return ''
      if (domRect.value && domRect.value?.length === 1)
        return domRect.value[0][calcType as ICalcType] + 'px'
      const _allRect = domRect.value.map((item) => {
        let value = item[calcType as ICalcType] || 0
        value = value.toFixed(2)
        return Math.floor(value) + 'px'
      })
      if (extraHeight) {
        _allRect.push(extraHeight)
      }
      allRect.value = `calc(${_allRect.join(' + ')})`
    },
    {
      deep: true,
    },
  )

  return {
    domRect,
    allRect,
  }
}
