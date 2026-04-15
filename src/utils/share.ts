import { getCurrentPageInfo } from './utils'
import { obj2Url } from './index'
import { checkLogin } from './common'
import { useLoginStore } from '@/store'
import { bindSalesUserApi } from '@/service/user'
import { getCache, setCache, removeCache } from './storage'
import PAGE_CACHE_KEY from '@/maps/chaheKeys'

/**
 * 判断是否为销售角色
 * @param accountType 账号类型
 * @returns 是否为销售角色
 */
export function isSalesRole(accountType: number): boolean {
  // SuperAdmin(1), Admin(2), AppUser(3), SalesUser(4)
  return [1, 2, 3, 4].includes(accountType)
}

/**
 * 构建分享路径
 * @param currentPath 当前页面路径，如 '/pages/index/index'
 * @param options 当前页面的参数对象
 * @param title 分享标题，可选
 * @returns 分享配置对象
 */
export function buildSharePath(
  currentPath: string,
  options: Record<string, any>,
  title?: string,
): { title: string; path: string } {
  const loginStore = useLoginStore()
  const accountType = loginStore.loginInfo?.accountType || 0
  const isSales = isSalesRole(accountType)

  // 复制 options，避免修改原对象
  const shareParams: Record<string, any> = { ...options }

  // 如果是销售角色，追加 salesUserId
  if (isSales) {
    const salesUserId = loginStore.loginInfo?.userId
    if (salesUserId) {
      shareParams.salesUserId = salesUserId
    }
  }

  // 使用 obj2Url 构建参数字符串（不编码，因为小程序会自动处理）
  // 如果 shareParams 为空对象，obj2Url 会返回 '?'，需要过滤掉
  const queryString = Object.keys(shareParams).length > 0 ? obj2Url(shareParams, false) : ''
  const path = currentPath + queryString

  return {
    title: title || '易联租车',
    path: path,
  }
}

/**
 * 处理页面加载时的 salesUserId
 * @param options 页面参数对象
 */
export async function handleSalesUserIdOnLoad(options: Record<string, any>): Promise<void> {
  const salesUserId = options.salesUserId
  if (!salesUserId) {
    return
  }

  const salesUserIdNum = Number(salesUserId)
  if (!salesUserIdNum || isNaN(salesUserIdNum)) {
    return
  }

  const isLogin = checkLogin()

  if (isLogin) {
    // 已登录，直接绑定
    try {
      await bindSalesUserApi(salesUserIdNum)
      // 绑定成功后清除缓存
      removeCache(PAGE_CACHE_KEY.SalesUserId)
    } catch (error) {
      // 静默失败，不影响用户体验
      console.error('绑定销售失败:', error)
    }
  } else {
    // 未登录，缓存起来
    setCache(PAGE_CACHE_KEY.SalesUserId, salesUserIdNum)
  }
}
