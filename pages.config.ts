import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    // navigationStyle: 'default',
    navigationStyle: 'custom',
    navigationBarTitleText: '易联租车',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
    pageOrientation: 'default',
    pageOrientation: 'auto',
    bounce: 'none', // 禁止页面回弹
    pullToRefresh: {
      color: '#1d2088',
    },
    titleNView: false,
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
    },
  },
  // tabBar: {
  //   color: '#999999',
  //   selectedColor: '#1a1a1a',
  //   backgroundColor: '#ffffff',
  //   height: '52px',
  //   fontSize: '11px',
  //   iconWidth: '18px',
  //   spacing: '3px',
  //   list: [
  //     {
  //       pagePath: 'pages/index/index',
  //       text: '首页',
  //     },
  //   ],
  // },
})
