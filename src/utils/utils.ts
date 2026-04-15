import dayjs from 'dayjs'
import { isImg, isPdf } from './fileTypeChecker'

export const isType = (type) => (target) =>
  `[object ${type}]` === Object.prototype.toString.call(target)
export const isString = isType('String')
export const isNumber = isType('Number')
export const isArray = isType('Array')
export const isObject = isType('Object')

/**
 * 补全url
 * @param url
 * @returns
 */
export const fullUrl = (url: string | any) => {
  if (!url || typeof url !== 'string') return ''
  const baseUrl = import.meta.env.VITE_SERVER_BASEURL
  return url.startsWith('http') || url.startsWith('blob') ? url : `${baseUrl}${url}`
}

/**
 * 把图片src替换为缩略图
 * @param src
 * @returns
 */
export const imgToThumb = (src: string) => {
  if (!src) return ''
  // 查看以什么后缀名
  const ext = src.split('.').pop()
  if (src.includes('_th.' + ext)) {
    return src
  }
  src = src.replace(`.${ext}`, `_th.${ext}`)
  return src
}

/**
 * 深度复制对象（简易版）
 * @param source
 * @returns {[]|{}}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 排序
export const sortBy = (key: string) => {
  return (a: any, b: any) => b[key] - a[key]
}

// 排序
export const sortAsc = (key: string) => {
  return (a: any, b: any) => a[key] - b[key]
}

// 排序
export const sortDesc = <T>(list, key: string = 'displaySort'): T => {
  return list.sort(sortBy(key))
}

/**
 * 处理rich-text的内容
 * @param res
 * @returns
 */
export function addBaseUrlByContent(res = '') {
  const baseUrl = import.meta.env.VITE_SERVER_BASEURL

  if (isString(res)) {
    res = res.replace(/.jpg" style="/g, '.jpg" data-style="')
    res = res.replace(/.png" style="/g, '.png" data-style="')
    res = res.replace(
      /src="\//g,
      'style="width:100%!important;height:auto!important;padding:5px 0;" src="' + baseUrl + '/',
    )
    // res = res.replace(/p style="/g, 'p style="font-size:14px;line-height:1.8;')
    res = res.replace(/&nbsp;/g, '\xa0')
  }
  return res
}

/**
 * 手机号码脱敏
 * @param phoneNumber
 * @returns
 */
export function desensitizePhoneNumber(phoneNumber) {
  if (!phoneNumber || phoneNumber.length !== 11) {
    return phoneNumber
  }
  // 保留前三位和后四位，其余用星号替换
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 打开文件
export function openFile(fileUrl, allImgList: string[] = []) {
  fileUrl = fullUrl(fileUrl)
  // 如果是图片格式
  if (isImg(fileUrl)) {
    uni.previewImage({
      urls: [fileUrl],
    })
  } else if (isPdf(fileUrl)) {
    // 如果是pdf文件，则打开pdf文件
    // 获取文件名
    const filename = fileUrl.split('/').pop()
  } else {
    uni.showToast({
      title: '暂不支持查看该格式文件',
      icon: 'none',
    })
  }
}

/**
 * 时间转换
 * @param data
 * @returns
 */
export const toInputTime = (data: string) => {
  if (!data) return null
  return dayjs(data).toDate()
}

/**
 * 时间转换
 * @param data
 * @param fmt
 * @returns
 */
export const toSubmitTime = (data: number | Date | string, fmt = 'YYYY-MM-DD') => {
  if (!data) return null
  return dayjs(data).format(fmt)
}

/** 添加全部选项 */
export const addAllOption = (
  list: any[],
  allLabel = '全部',
  allValue: number | string = 0,
  opts: { valueName?: string; labelName?: string } = {
    valueName: 'value',
    labelName: 'label',
  },
) => {
  return [{ [opts.labelName]: allLabel, [opts.valueName]: allValue }, ...list]
}

/** 枚举转换为选项 */
export function enumToOptions(
  enumObj: Record<string, string>,
  opts: {
    isAddAll?: boolean
    isFilterUnKnow?: boolean
    valueName?: string
    labelName?: string
    allLabel?: string
    allValue?: string | number
    callback?: (options: any[]) => any[]
  } = {
    isAddAll: true,
    isFilterUnKnow: true,
    valueName: 'value',
    labelName: 'label',
    allLabel: '请选择',
    allValue: 0,
    callback: (options: any[]) => options,
  },
) {
  const {
    valueName = 'value',
    labelName = 'label',
    isAddAll = true,
    isFilterUnKnow = true,
    allLabel = '请选择',
    allValue = 0,
  } = opts

  let options = Object.keys(enumObj).map((key) => ({
    [labelName]: enumObj[key],
    [valueName]: +key,
  }))
  if (isFilterUnKnow) {
    options = options.filter((item) => {
      return +item[valueName]
    })
  }
  if (isAddAll) {
    options = addAllOption(options, allLabel, allValue, {
      valueName,
      labelName,
    })
  }
  return options
}

/** 转换为页面上传图片需要的数据格式 */
export function toPageUploadImg(url: string) {
  return [
    {
      url: fullUrl(url),
      relativeUrl: url,
    },
  ]
}

/** 转换为页面上传图片需要的数据格式 */
export function toPageUploadImgList(urlList: string[]) {
  return urlList.map((url) => ({
    url: fullUrl(url),
    relativeUrl: url,
  }))
}

/** 渲染字典数据 */
export function renderDictData(list, value) {
  const item = list.find((r) => r.value === value)
  return item?.label ?? '-'
}

/**
 * 将数字格式化为金额显示
 * @param {number} num - 要格式化的数字
 * @param {number} [decimals=2] - 保留小数位数
 * @param {string} [separator=','] - 千位分隔符
 * @returns {string} 格式化后的金额字符串
 */
export function formatMoney(num, decimals = 2, separator = ',') {
  if (typeof num !== 'number') return '0.00'

  const parts = num.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return parts.join('.')
}

/** 是否是开发环境 */
export const isDev = () => {
  return import.meta.env.DEV
}

/** 是否是空值 */
export const isEmptyValue = (obj: any) => {
  return Object.keys(obj).every(
    (key) =>
      obj[key] === '' ||
      obj[key] === 0 ||
      obj[key] === null ||
      obj[key] === undefined ||
      (typeof obj[key] === 'boolean' && !obj[key]) ||
      (Array.isArray(obj[key]) && obj[key].length === 0) ||
      (typeof obj[key] === 'object' && isEmptyValue(obj[key])),
  )
}

/**
 * 打开小程序
 * @param path 小程序路径
 */
export function openMiniProgram(path?: string) {
  // 如果是网页端，用跳转链接的方式
  // #ifdef H5
  window.location.href = path
  // #endif

  // 如果是app端，用跳转链接的方式
  // #ifdef APP-PLUS
  plus.runtime.openURL(path)
  // #endif
}

/**
 * 简单的URL格式验证
 * @param str
 * @returns
 */
export const isValidUrl = (str: string): boolean => {
  // 检查基本的URL结构
  const basicCheck =
    str.includes('.') &&
    (str.startsWith('http://') || str.startsWith('https://') || !str.includes('://'))

  // 检查是否包含非法字符
  const invalidChars = /[\s<>\\]/
  const hasInvalidChars = invalidChars.test(str)

  return basicCheck && !hasInvalidChars
}

/**
 * 获取当前页面信息
 * @returns
 */
export function getCurrentPageInfo(): {
  currentPage: any
  currentUrl: string
  options: any
} {
  // 根据当前url获取当前步骤
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const currentUrl = '/' + currentPage.route.split('?')[0]
  const options =
    currentPage?.options ?? currentPage?.$vm?.options ?? currentPage?.$page?.options ?? {}
  return {
    currentPage,
    currentUrl,
    options,
  }
}

/**
 * 格式化数字，控制小数位数
 * @param num 要格式化的数字
 * @param decimals 保留的小数位数，默认为2位
 */
export function formatDecimal(num: number | string, decimals: number = 2) {
  if (num === null || num === undefined) {
    return '0'
  }
  // 如果是字符串类型，尝试转换为数字
  if (typeof num === 'string') {
    num = parseFloat(num)
    if (isNaN(num)) {
      return '0'
    }
  }
  if (typeof num !== 'number' || isNaN(num)) {
    return '0'
  }
  // 将数字转换为字符串，最多保留指定小数位数
  const str = num.toString()
  const parts = str.split('.')
  if (parts.length === 1) {
    return parts[0]
  }
  // 如果小数部分超过指定位数，则截取前几位
  const decimal = parts[1].length > decimals ? parts[1].slice(0, decimals) : parts[1]
  return `${parts[0]}.${decimal}`
}

/** 把图片url转换为缩略图url */
export function imgUrlToThumb(url: string) {
  // 如果有_th之后
  if (url.includes('_th.')) {
    return url
  }
  const urlArr = url.split('.')
  const ext = urlArr.pop()
  return urlArr.join('.') + '_th.' + ext
}

/** 数组分组 */
export function groupArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}
