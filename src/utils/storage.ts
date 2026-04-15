/**
 * 获取缓存
 * @param {String} key 键名
 */
export function getCache(key: string) {
  const v = uni.getStorageSync(key)
  try {
    if (v === '' || typeof v === 'undefined') {
      return ''
    }
    return JSON.parse(v)
  } catch (error) {
    return v
  }
}

/**
 * 设置缓存
 * @param {String} key 键名
 * @param {*} value 值
 */
export function setCache(key: string, value) {
  if (typeof value === 'undefined') {
    return
  }
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  console.log(value)
  uni.setStorageSync(key, value)
}

/**
 * 清除指定的缓存
 * @param {String} key 键名
 */
export function removeCache(key: string) {
  if (typeof key !== 'undefined') {
    uni.removeStorageSync(key)
  }
}
