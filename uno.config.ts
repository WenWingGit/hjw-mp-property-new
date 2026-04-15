// uno.config.ts
import {
  type Preset,
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { presetApplet, presetRemRpx, transformerAttributify } from 'unocss-applet'

// @see https://unocss.dev/presets/legacy-compat
// import { presetLegacyCompat } from '@unocss/preset-legacy-compat'

const isMp = process.env?.UNI_PLATFORM?.startsWith('mp') ?? false

const presets: Preset[] = []
if (isMp) {
  // 使用小程序预设
  presets.push(presetApplet(), presetRemRpx())
} else {
  presets.push(
    // 非小程序用官方预设
    presetApplet(),
    // presetRemRpx(),
    // 支持css class属性化
    presetAttributify(),
  )
}

// 根据ide.code.fun里面 ml-10 -> margin-left: 20rpx;
// 所以配置成 sx-ml-10 -> margin-left: 20rpx;
const designSize = 1920
const designRatios = 1920 / designSize

export default defineConfig({
  presets: [
    ...presets,
    // 支持图标，需要搭配图标库，eg: @iconify-json/carbon, 使用 `<button class="i-carbon-sun dark:i-carbon-moon" />`
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    // 将颜色函数 (rgb()和hsl()) 从空格分隔转换为逗号分隔，更好的兼容性app端，example：
    // `rgb(255 0 0)` -> `rgb(255, 0, 0)`
    // `rgba(255 0 0 / 0.5)` -> `rgba(255, 0, 0, 0.5)`
    // 与群友的正常写法冲突，先去掉！（2024-05-25）
    // presetLegacyCompat({
    //   commaStyleColorFunction: true,
    // }) as Preset,
  ],
  /**
   * 自定义快捷语句
   * @see https://github.com/unocss/unocss#shortcuts
   */
  shortcuts: [['fc', 'flex justify-center items-center']],
  transformers: [
    // 启用 @apply 功能
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
    // Don't change the following order
    transformerAttributify({
      // 解决与第三方框架样式冲突问题
      prefixedOnly: true,
      prefix: 'sx',
    }),
  ],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],

    [/^sx-min-w-(\d+)$/, ([, d]) => ({ 'min-width': `${+d * designRatios}rpx` })],
    [/^sx-min-h-(\d+)$/, ([, d]) => ({ 'min-height': `${+d * designRatios}rpx` })],
    [/^sx-max-w-(\d+)$/, ([, d]) => ({ 'max-width': `${+d * designRatios}rpx` })],
    [/^sx-max-h-(\d+)$/, ([, d]) => ({ 'max-height': `${+d * designRatios}rpx` })],
    [/^sx-gap-(\d+)$/, ([, d]) => ({ gap: `${+d * designRatios}rpx` })],
    [/^sx-w-(\d+)$/, ([, d]) => ({ width: `${+d * designRatios}rpx` })],
    [/^sx-h-(\d+)$/, ([, d]) => ({ height: `${+d * designRatios}rpx` })],
    [/^sx-fz-(\d+)$/, ([, d]) => ({ 'font-size': `${+d * designRatios}rpx` })],
    [/^sx-p-(\d+)$/, ([, d]) => ({ padding: `${+d * designRatios}rpx` })],
    [
      /^sx-px-(\d+)$/,
      ([, d]) => ({
        'padding-left': `${+d * designRatios}rpx`,
        'padding-right': `${+d * designRatios}rpx`,
      }),
    ],
    [
      /^sx-py-(\d+)$/,
      ([, d]) => ({
        'padding-top': `${+d * designRatios}rpx`,
        'padding-bottom': `${+d * designRatios}rpx`,
      }),
    ],
    [/^sx-pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${+d * designRatios}rpx` })],
    [/^sx-pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${+d * designRatios}rpx` })],
    [/^sx-pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${+d * designRatios}rpx` })],
    [/^sx-pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${+d * designRatios}rpx` })],
    [/^sx-mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${+d * designRatios}rpx` })],
    [/^sx-m-(\d+)$/, ([, d]) => ({ margin: `${+d * designRatios}rpx` })],
    [
      /^sx-mx-(\d+)$/,
      ([, d]) => ({
        'margin-left': `${+d * designRatios}rpx`,
        'margin-right': `${+d * designRatios}rpx`,
      }),
    ],
    [
      /^sx-my-(\d+)$/,
      ([, d]) => ({
        'margin-top': `${+d * designRatios}rpx`,
        'margin-bottom': `${+d * designRatios}rpx`,
      }),
    ],
    [/^sx-mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${+d * designRatios}rpx` })],
    [/^sx-ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${+d * designRatios}rpx` })],
    [/^sx-mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${+d * designRatios}rpx` })],
    [/^sx-t-(\d+)$/, ([, d]) => ({ top: `${+d * designRatios}rpx` })],
    [/^sx-l-(\d+)$/, ([, d]) => ({ left: `${+d * designRatios}rpx` })],
    [/^sx-r-(\d+)$/, ([, d]) => ({ right: `${+d * designRatios}rpx` })],
    [/^sx-b-(\d+)$/, ([, d]) => ({ bottom: `${+d * designRatios}rpx` })],
    [/^sx-radius-(\d+)$/, ([, d]) => ({ 'border-radius': `${+d * designRatios}rpx` })],
    [/^sx-color-([A-Za-z0-9]+)$/, ([, d]) => ({ color: `#${d}` })],
    [/^sx-bg-([A-Za-z0-9]+)$/, ([, d]) => ({ 'background-color': `#${d}` })],
    [/^sx-border-color-([A-Za-z0-9]+)$/, ([, d]) => ({ 'border-color': `#${d}` })],
    [
      /^sx-lh-(\d+)$/,
      ([, d]) => {
        if (+d > 5) {
          return { 'line-height': `${+d * designRatios}rpx` }
        } else {
          return { 'line-height': `${+d * designRatios}` }
        }
      },
    ],
  ],
  preflights: [
    {
      getCSS: () => {
        const tag = 'page,view,input'
        return `${tag},view::before,view::after{box-sizing:border-box;}`
      },
    },
  ],
})

/**
 * 最终这一套组合下来会得到：
 * mp 里面：mt-4 => margin-top: 32rpx  == 16px
 * h5 里面：mt-4 => margin-top: 1rem == 16px
 *
 * 如果是传统方式写样式，则推荐设计稿设置为 750，这样设计稿1px，代码写1rpx。
 * rpx是响应式的，可以让不同设备的屏幕显示效果保持一致。
 */
