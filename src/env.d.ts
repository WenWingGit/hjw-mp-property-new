/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  /** 网站标题，应用名称 */
  readonly VITE_APP_TITLE: string
  /** 服务端口号 */
  readonly VITE_SERVER_PORT: string
  /** 后台接口地址 */
  readonly VITE_SERVER_BASEURL: string
  /** H5是否需要代理 */
  readonly VITE_APP_PROXY: 'true' | 'false'
  /** H5是否需要代理，需要的话有个前缀 */
  // 门店端代理前缀
  readonly VITE_APP_PROXY_PREFIX: string // 一般是/api

  /** 缓存版本 */
  readonly VITE_APP_CACHE_VERSION: string

  /** 上传图片地址 */
  readonly VITE_UPLOAD_BASEURL: string
  /** 上传文件地址 */
  readonly VITE_UPLOAD_FILE_BASEURL: string

  readonly VITE_NOT_NEED_LOGIN: boolean

  /** 是否清除console */
  readonly VITE_DELETE_CONSOLE: string
  // 更多环境变量...

  /** 版本号 */
  readonly VITE_APP_VERSION: string
  // 首页
  readonly VITE_APP_HOME_PAGE: string

  // 登录页
  readonly VITE_APP_LOGIN_PAGE: string

  // 是否為靜態頁面
  readonly VITE_IS_STATIC_PAGE: boolean

  readonly VITE_APP_LABEL_KEY: string
  readonly VITE_APP_VALUE_KEY: string

  readonly VITE_APP_CLIENT_ID: string
  readonly VITE_APP_GRANT_TYPE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
