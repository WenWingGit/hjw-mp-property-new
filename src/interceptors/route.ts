/**
 * 路由拦截，通常也是登录拦截
 * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
 * 我这里应为大部分都可以随便进入，所以使用黑名单
 */
import { PageKey } from '@/maps/pageKeys'
import { useLoginStore } from '@/store'
import { getNeedLoginPages, needLoginPages as _needLoginPages } from '@/utils'

const loginRoute = PageKey.LOGIN as string

const isLogined = () => {
  const loginStore = useLoginStore()
  return loginStore.isLogined
}

const isDev = import.meta.env.DEV

// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke({ url }: { url: string }) {
    // console.log(url) // /pages/route-interceptor/index?name=feige&age=30
    const path = url.split('?')[0]
    let needLoginPages: string[] = []
    // 为了防止开发时出现BUG，这里每次都获取一下。生产环境可以移到函数外，性能更好
    // if (isDev) {
    //   needLoginPages = getNeedLoginPages()
    // } else {
    //   needLoginPages = _needLoginPages
    // }
    // const isNeedLogin = needLoginPages.includes(path)
    // if (!isNeedLogin) {
    //   return true
    // }
    // const hasLogin = isLogined()
    // console.log('hasLogin', hasLogin)
    // if (hasLogin) {
    //   if (path === '/pages/login/login') {
    //     uni.navigateTo({ url: '/pages/index/index' })
    //     return false
    //   }
    //   return true
    // }

    // 小程序端，需要登录，跳转登录页
    // const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
    // uni.navigateTo({ url: redirectRoute })

    // app端，打开就是登录页
    // uni.reLaunch({ url: loginRoute })
    // return false

    return true
  },
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
  },
}
