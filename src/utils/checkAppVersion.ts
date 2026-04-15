import { getLastAppVersionApi } from '@/service/common/common'
import { fullUrl } from './utils'
import { getCache, removeCache, setCache } from './storage'
import PAGE_CACHE_KEY from '@/maps/chaheKeys'

/** 忽略升级的缓存key */
const cacheKey = 'ignoreUpdateVersions'

/** 下载进度状态 */
interface DownloadProgress {
  visible: boolean
  version: string
  progress: number
  currentSize: number
  totalSize: number
  status: 'downloading' | 'installing' | 'success' | 'error'
}

/** 创建下载进度状态 */
const downloadProgress = ref<DownloadProgress>({
  visible: false,
  version: '',
  progress: 0,
  currentSize: 0,
  totalSize: 0,
  status: 'downloading',
})

/**
 * 检查是否需要更新
 * @param isShowDialog 是否显示对话框
 * @param isForceShow 是否强制显示
 * @returns 是否需要更新
 */
export async function checkForUpdate(
  isShowDialog: boolean = false,
  isForceShow: boolean = false,
): Promise<{ hasUpdate: boolean; versionTxt: string }> {
  // 检查是否正在下载或安装
  if (
    downloadProgress.value.visible &&
    ['downloading', 'installing'].includes(downloadProgress.value.status)
  ) {
    return Promise.resolve({
      hasUpdate: true,
      versionTxt: downloadProgress.value.version,
    })
  }

  // 只在 app 中才会执行以下代码
  const nowVersion = import.meta.env.VITE_APP_VERSION
  // 送请求检查是否需要更新
  const res = await getLastAppVersionApi()
  let versionTxt = nowVersion
  let hasUpdate = false
  if (res?.data && res.data?.versionTxt) {
    const { appFilePath, isForceUpgrade } = res.data
    versionTxt = 'v' + (res?.data?.versionTxt || '')
    hasUpdate = isVersionGreaterThan(versionTxt, nowVersion)

    console.log('versionTxt', versionTxt, 'nowVersion', nowVersion, 'hasUpdate', hasUpdate)
    if (!hasUpdate) {
      // 当前版本是最新版本
      if (isShowDialog && isForceShow) {
        uni.showToast({
          title: '当前为最新版本',
          icon: 'none',
        })
      }
      return Promise.resolve({
        hasUpdate,
        versionTxt,
      })
    }

    // 有新版本更新且不忽略更新
    const ignoreVersion = getCache(cacheKey) ?? ''
    const downloadUrl = fullUrl(appFilePath)
    if ((isShowDialog && ignoreVersion !== versionTxt) || isForceShow) {
      showUpdateDialog(versionTxt, downloadUrl, isForceUpgrade)
      return Promise.resolve({
        hasUpdate,
        versionTxt,
      })
    }
  }
  return Promise.resolve({
    hasUpdate,
    versionTxt,
  })
}

/**
 * 判断是否需要更新
 * @param version1 版本1
 * @param version2 版本2
 * @returns 是否需要更新
 */
function isVersionGreaterThan(version1: string, version2: string) {
  const v1 = version1.split('.')
  const v2 = version2.split('.')
  return v1[0] > v2[0] || v1[1] > v2[1] || v1[2] > v2[2]
}

/**
 * 显示更新对话框
 * @param versionTxt 版本号
 * @param downloadUrl 下载地址
 * @param isForceUpgrade 是否强制升级
 */
function showUpdateDialog(versionTxt: string, downloadUrl: string, isForceUpgrade: boolean) {
  const systemInfo = uni.getSystemInfoSync()
  uni.showModal({
    title: '新版本发布',
    content: '检查到当前有新版本(' + versionTxt + '),需要更新吗？',
    showCancel: true,
    confirmText: '立即更新',
    cancelText: '暂不更新',
    success: (modalRes) => {
      if (modalRes.confirm) {
        removeCache(cacheKey)
        startDownload(versionTxt, downloadUrl, isForceUpgrade)
      } else {
        if (isForceUpgrade) {
          if (systemInfo.platform === 'android') {
            plus.runtime.quit()
          }
        } else {
          setCache(cacheKey, versionTxt)
        }
      }
    },
  })
}

/**
 * 开始下载
 * @param versionTxt 版本号
 * @param downloadUrl 下载地址
 * @param isForceUpgrade 是否强制升级
 */
function startDownload(versionTxt: string, downloadUrl: string, isForceUpgrade: boolean) {
  const localDownloadPath = getCache(PAGE_CACHE_KEY.DOWNLOAD_URL)
  if (localDownloadPath) {
    installApp(localDownloadPath)
    return
  }

  // 显示下载进度
  downloadProgress.value = {
    visible: true,
    version: versionTxt,
    progress: 0,
    currentSize: 0,
    totalSize: 0,
    status: 'downloading',
  }
  console.log('startDownload', downloadUrl)

  const downloadTask = uni.downloadFile({
    url: downloadUrl,
    success: (downloadRes) => {
      if (downloadRes.statusCode === 200) {
        downloadProgress.value.status = 'installing'
        installApp(downloadRes.tempFilePath)
      } else {
        downloadProgress.value.status = 'error'
        setTimeout(() => {
          downloadProgress.value.visible = false
          uni.showToast({
            title: '下载失败',
            icon: 'none',
            mask: true,
          })
        }, 1500)
      }
    },
    fail: (fail) => {
      console.log('网络错误，下载失败！', fail)
      downloadProgress.value.status = 'error'
      setTimeout(() => {
        downloadProgress.value.visible = false
        uni.showToast({
          title: '下载失败',
          icon: 'none',
          mask: true,
        })
      }, 1500)
    },
  })

  // 监听下载进度
  downloadTask.onProgressUpdate((res) => {
    downloadProgress.value.progress = res.progress
    downloadProgress.value.currentSize = res.totalBytesWritten
    downloadProgress.value.totalSize = res.totalBytesExpectedToWrite
  })
}

/**
 * 安装app
 * @param downloadPath 下载路径
 */
function installApp(downloadPath: string) {
  plus.runtime.install(
    downloadPath,
    {
      force: true,
    },
    () => {
      console.log('install success...')
      downloadProgress.value.status = 'success'
      setTimeout(() => {
        removeCache(PAGE_CACHE_KEY.DOWNLOAD_URL)
        downloadProgress.value.visible = false
        plus.runtime.restart()
      }, 1500)
    },
    (e) => {
      console.log('install fail...', e)
      downloadProgress.value.status = 'error'
      setTimeout(() => {
        downloadProgress.value.visible = false
        uni.showToast({
          title: '安装失败:' + JSON.stringify(e),
          icon: 'fail',
          mask: true,
          duration: 1500,
        })
      }, 1500)
    },
  )
}
// 导出下载进度状态
export { downloadProgress, installApp }
