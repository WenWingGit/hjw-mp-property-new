import { IResPageList, IReqPageList } from '@/typings'

export interface INoticeArticlePageItemsReq extends IReqPageList {
  /** 标题 */
  title?: string
  /** 搜索值 */
  searchValue?: string
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
  /** 排序类型 */
  noticeArticleSortType?: 0 | 1 | 2
}

export interface INoticeArticleItem {
  title: string
  content: string
  createdTime: string
  createdTimeStr: string
  id: number
  pageIndex?: number
}

export interface INoticeArticleDetail {
  title: string
  content: string
  createdTime: string
  createdTimeStr: string
  id: number
}
