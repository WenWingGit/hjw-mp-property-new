import { $tips } from '@/utils/common'

//    * @param request0Remove 请求时如果参数为0就去掉
export default function (
  apiFn,
  defaultQuery,
  {
    isAutoLoad = true,
    isShowLoading = false,
    request0Remove = [],
    loadedCallBack = () => {},
    loadBefore = () => {},
  } = {},
) {
  const isRefreshLoading = ref(false)

  const list = ref([])

  // 分页查询参数
  const pageQuery = reactive(defaultQuery)

  // 列表加载状态
  const listStatus = reactive({
    isLoading: false,
    isEmpty: false,
    isNoMore: false,
    totalCount: 0,
  })

  /** 对齐后端返回的页码信息 */
  const pageInfo = ref({
    current: 0,
    limit: 0,
    totalPage: 0,
    total: 0,
  })

  const allList = ref([])

  onMounted(() => {
    if (isAutoLoad) {
      getList()
    }
  })

  /**
   * 获取列表数据
   * @param isRefresh 是否刷新
   * @param isShowLoading 是否显示加载中
   * @param appointPage 指定页码(只更新指定页码的数据)(例如从详情页返回到列表页时，需要更新指定页码的数据)
   * @param appointItemKey 指定数据key 默认用id
   * @param callBack 回调函数
   * @returns
   */
  async function getList({
    isRefresh,
    isShowLoading: _isShowLoading = false,
    appointPage = 0,
    appointItemId = 0,
    appointItemKey = 'id',
    callBack = () => {},
  } = {}) {
    listStatus.isLoading = true

    if (isRefresh) {
      list.value.length = 0
    }
    let _pageQuery = {
      ...pageQuery,
    }
    if (typeof loadBefore === 'function') {
      _pageQuery = loadBefore(_pageQuery)
    }

    if (appointPage > 0) {
      _pageQuery.page = appointPage
    }
    if (request0Remove.length) {
      for (const index in request0Remove) {
        const key = request0Remove[index]
        if (_pageQuery[key] !== '0' || _pageQuery[key] == 0) {
          delete _pageQuery[key]
        }
      }
    }
    const res = await apiFn(_pageQuery, {
      isShowLoading: (isShowLoading && _isShowLoading) || pageQuery.page !== 1,
    })
    listStatus.isLoading = false
    if (res?.code === '0000') {
      const resList = (res?.data?.rows ?? []).map((item) => {
        return {
          ...item,
          pageIndex: _pageQuery.page,
        }
      })

      // 更新指定页的数据
      if (appointPage > 0) {
        // 只更新对应页的数据
        let oldList = list.value || []
        oldList = oldList
          .filter((oldItem) => {
            if (oldItem.pageIndex === _pageQuery.page) {
              return resList.find((t) => t[appointItemKey] === oldItem[appointItemKey])
            }
          })
          .map((oldItem) => {
            const matchItem = resList.find((t) => t[appointItemKey] === oldItem[appointItemKey])
            if (matchItem) {
              oldItem = matchItem
            }
            return oldItem
          })

        list.value = resList
        listStatus.isEmpty = (list.value?.length ?? 0) === 0
        listStatus.totalCount = res?.data?.total ?? 0
      } else {
        const _list = loadedCallBack?.(resList) ?? resList
        list.value = [...list.value, ..._list]
        listStatus.isEmpty = (list.value?.length ?? 0) === 0
        listStatus.isNoMore = (res?.data?.current ?? 0) >= (res?.data?.totalPage ?? 0)
        listStatus.totalCount = res?.data?.total ?? 0

        pageInfo.value = {
          current: res?.data?.current ?? 0,
          limit: res?.data?.limit ?? 0,
          totalPage: res?.data?.totalPage ?? 0,
          total: res?.data?.total ?? 0,
        }
      }
      callBack && callBack()
    }
  }

  const onRefresh = async () => {
    pageQuery.page = 1
    isRefreshLoading.value = true
    await getList({ isRefresh: true })
    uni.stopPullDownRefresh()
    isRefreshLoading.value = false
    $tips('刷新成功')
  }

  async function onLoadMore() {
    if (listStatus.isNoMore || listStatus.isLoading) return
    pageQuery.page++
    await getList()
  }

  const onInitList = async () => {
    pageQuery.page = 1
    list.value.length = 0
    getList({ isRefresh: true })
  }

  return {
    isRefreshLoading,
    list,
    allList,
    pageQuery,
    listStatus,
    pageInfo,
    getList,
    onRefresh,
    onLoadMore,
    onInitList,
  }
}
