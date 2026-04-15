export const platform = __UNI_PLATFORM__
export const isH5 = __UNI_PLATFORM__ === 'h5'
export const isApp = __UNI_PLATFORM__ === 'app'
export const isMp = __UNI_PLATFORM__.startsWith('mp-')

export const isWxMiniProgram = platform === 'mp-weixin'

/**
 * 平台信息
 */
const PLATFORM = {
  platform,
  isH5,
  isApp,
  isMp,
  isAndroid: false,
  isIOS: false,
  isWxMiniProgram,
}

// #ifdef APP-PLUS
/**
 * 判断是否是安卓设备
 * @returns boolean
 */
PLATFORM.isAndroid = plus.os.name === 'Android'

/**
 * 判断是否是IOS设备
 * @returns boolean
 */
PLATFORM.isIOS = plus.os.name === 'iOS'
// #endif

export default PLATFORM
