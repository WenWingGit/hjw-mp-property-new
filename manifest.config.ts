// manifest.config.ts
import { defineManifestConfig, PNG } from '@uni-helper/vite-plugin-uni-manifest'
import path from 'node:path'
import { loadEnv } from 'vite'

// 获取环境变量的范例
const env = loadEnv(process.env.NODE_ENV!, path.resolve(process.cwd(), 'env'))
const {
  VITE_APP_TITLE,
  VITE_UNI_APPID,
  VITE_WX_APPID,
  VITE_APP_PUBLIC_BASE,
  VITE_APP_VERSION,
  VITE_APP_INNER_VERSION,
  VITE_FALLBACK_LOCALE,
} = env

export default defineManifestConfig({
  name: VITE_APP_TITLE,
  appid: VITE_UNI_APPID,
  description: '',
  versionName: VITE_APP_VERSION?.replace('v', '') || '1.0.0',
  versionCode: VITE_APP_INNER_VERSION,
  transformPx: false,
  locale: VITE_FALLBACK_LOCALE, // 'zh-Hans'
  h5: {
    router: {
      base: VITE_APP_PUBLIC_BASE,
    },
    rpxCalcBaseDeviceWidth: 1920,
    rpxCalcMaxDeviceWidth: 1920,
    rpxCalcIncludeWidth: 1920,
  },
  /* 5+App特有相关 */
  'app-plus': {
    rpxCalcBaseDeviceWidth: 1920,
    rpxCalcMaxDeviceWidth: 1920,
    rpxCalcIncludeWidth: 1920,
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    compilerVersion: 3,
    // 侧滑返回功能，可选值："close"（启用侧滑返回）、"none"（禁用侧滑返回）
    popGesture: 'none',
    launchwebview: {
      plusrequire: 'normal',
      // 开启沉浸式状态栏
      immersive: true,
    },
    compatible: {
      ignoreVersion: true,
    },
    permissions: {
      camera: {
        desc: '我们需要您的相机权限，以便您可以拍摄照片或录制视频。',
      },
    },
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0,
      fullscreen: true,
    },
    /* 模块配置 */
    modules: {
      Barcode: {},
      Camera: {},
      Geolocation: {},
      LivePusher: {},
      VideoPlayer: {},
    },
    /* 应用发布信息 */
    distribute: {
      /* android打包配置 */
      android: {
        urltypes: 'ylqc',
        minSdkVersion: 27,
        targetSdkVersion: 27,
        abiFilters: ['armeabi-v7a', 'x86'],
        permissions: [
          '<uses-permission android:name="android.permission.CALL_PHONE"/>',
          '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
          '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>',
          '<uses-permission android:name="android.permission.RECORD_AUDIO"/>',
        ],
      },
      /* ios打包配置 */
      ios: {
        privacyDescription: {
          NSPhotoLibraryUsageDescription: '该应用需要读取你的相册，以便为你编辑头像图片',
          camera: '该应用需要你的相机，用于拍摄图片',
          NSCameraUsageDescription: '该应用需要你的相机，以便你拍摄上传图片',
          // 添加麦克风使用说明
          NSMicrophoneUsageDescription: '该应用需要访问麦克风以便进行语音录制功能',
        },
        urltypes: 'ylqc',
        idfa: false,
      },
      /* SDK配置 */
      sdkConfigs: {
        geolocation: {
          system: {
            __platform__: ['ios', 'android'],
          },
        },
      },
      /* 图标配置 */

      icons: {
        android: {
          hdpi: '/unpackage/res/icons/72x72.png',
          xhdpi: '/unpackage/res/icons/96x96.png',
          xxhdpi: '/unpackage/res/icons/144x144.png',
          xxxhdpi: '/unpackage/res/icons/192x192.png',
        },
        ios: {
          iphone: {
            'spotlight@3x': 'unpackage/res/icons/120x120.png',
            'app@2x': 'unpackage/res/icons/120x120.png',
            'app@3x': 'unpackage/res/icons/180x180.png',
            'spotlight@2x': 'unpackage/res/icons/80x80.png',
            'settings@2x': 'unpackage/res/icons/58x58.png',
            'settings@3x': 'unpackage/res/icons/87x87.png',
            'notification@2x': 'unpackage/res/icons/40x40.png',
            'notification@3x': 'unpackage/res/icons/60x60.png',
          },
          ipad: {
            app: 'unpackage/res/icons/76x76.png',
            'app@2x': 'unpackage/res/icons/152x152.png',
            'proapp@2x': 'unpackage/res/icons/167x167.png',
            spotlight: 'unpackage/res/icons/40x40.png',
            'spotlight@2x': 'unpackage/res/icons/80x80.png',
            settings: 'unpackage/res/icons/29x29.png',
            'settings@2x': 'unpackage/res/icons/58x58.png',
            notification: 'unpackage/res/icons/20x20.png',
            'notification@2x': 'unpackage/res/icons/40x40.png',
          },
          appstore: 'unpackage/res/icons/1024x1024.png',
        },
      },
    },
    nativePlugins: {},
  },
  /* 快应用特有相关 */
  quickapp: {},
  /* 小程序特有相关 */
  'mp-weixin': {
    appid: VITE_WX_APPID,
    setting: {
      urlCheck: false,
    },
    usingComponents: true,
    // __usePrivacyCheck__: true,
  },
  'mp-alipay': {
    usingComponents: true,
    styleIsolation: 'shared',
  },
  'mp-baidu': {
    usingComponents: true,
  },
  'mp-toutiao': {
    usingComponents: true,
  },
  uniStatistics: {
    enable: false,
  },
  vueVersion: '3',
})
