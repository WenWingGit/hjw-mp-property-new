import { BannerTypeEnum } from '@/enum/bannerType.ts'
import { IReqPageList, IResPageList } from '@/typings'

/** 版本信息 */
export interface IVersionItem {
  version: number
  versionTxt: string
  descn: string
  appFilePath: string
  isForceUpgrade: boolean
  isEnabled: boolean
  appType: number
  createdTime: string
  id: number
}

/** 获取Banner列表请求参数 */
export interface IGetBannerListReq extends IReqPageList {
  bannerType: BannerTypeEnum
}

/** 获取Banner列表响应参数 */
export interface IGetBannerListRes extends IResPageList<IBannerItemRes[]> {}

/** Banner项目 */
export interface IBannerItemRes {
  id: number
  createdUserId: number
  createdStoreId: number
  affiliatedStoreId: number
  affiliatedUserId: number
  bannerType: BannerTypeEnum
  title: string
  img: string
  displaySort: number
  jumpUrl: string
  isEnabled: boolean
  createdTime: string
}

/** 响应的文件项 */
export interface IFileItemRes {
  /** 文件路径 */
  filePath: string
  /** 是否是图片 */
  isImg?: boolean
  /** 原始文件名 */
  oriName?: string
  /** 缩略图路径 */
  thImgPath?: string
}
