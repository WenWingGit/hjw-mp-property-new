// 全局要用的类型放到这里

// 请求返回数据类型
export type IResData<T> = {
  code: number | string
  message: string
  data: T
  success: boolean
  timestamp: number
  __abp: boolean
}

// 分页数据类型
export interface IResPageList<T> {
  isLoading?: boolean
  pageIndex: number
  pageSize: number
  totalPage: number
  totalRows: number
  rows: T
  hasNextPage: boolean
  hasPreviousPage: boolean
  dict?: Record<string, any>
}

// 请求分页参数
export interface IReqPageList {
  pageIndex?: number
  pageSize?: number
}

// uni.uploadFile文件上传参数
export type IUniUploadFileOptions = {
  file?: File
  files?: UniApp.UploadFileOptionFiles[]
  filePath?: string
  name?: string
  formData?: any
}

/** 保存登录信息 */
export type ISaveLoginInfo = {
  // type?: IAccountType
  account: string
  password?: string
  // storeLoginName?: string
}

export type ILoginAccount = {
  account: string
  password: string
  storeLoginName?: string
}

// tab
export type ITabItem = {
  id: number
  name?: string
}

export type IChangePwd = {
  oldPassword: string
  newPassword: string
  newConfirmPassword: string
}

export type IdNumber = number | string

/** 上传文件项 */
export type IReqUploadFileItem = {
  filePath: string
  oriName: string
  isImg?: boolean
  thImgPath?: string
}

/** 附件项 */
export type IAttachmentItem = {
  filePath: string
  oriName: string
  isImg?: boolean
  thImgPath?: string
}

// 公告的图片显示模式枚举 正常图片 | 大图模式 | 无图模式
export type INewsImageMode = 'normal' | 'large' | 'none'

/** 布局卡片 */
export interface ILayoutCardItem {
  id: string
  name: string
  nameEn: string
  componentName: string
  imageMode?: INewsImageMode
  gridPos: { x: number; y: number; w: number; h: number }
  data?: any
}

/** 学生信息 */
export interface IStudentItem {
  id: number
  name: string
  gender: '男' | '女'
  age: number
  className: string
  position: string
  birthDate: string
  avatar: string
  isTodayStar?: boolean
}

/** 班级详细信息 */
export interface IClassDetailInfo {
  className: string
  teacherName: string
  motto: string
  totalCount: number
  signedCount: number
  absentCount: number
  lateCount: number
}

/** 新闻列表项 */
export interface INewsItem {
  id: number | string
  title: string
  cover: string
  publishTime: string
  content: string
  category?: string
}

/** 课程项 */
export interface ICourseItem {
  id: number | string
  period: number // 第几节课 [1-5]
  startTime: string // 开始时间 "08:00"
  endTime: string // 结束时间 "08:50"
  subject: string // 科目名称 "数学"
  teacher: string // 任课老师 "张蕾莎"
  dayOfWeek: number // 星期几 [1-7]，1=星期一
  status?: 'pending' | 'ongoing' | 'completed' | 'cancelled'
  location?: string // 教室位置（可选）
  courseType?: 'normal' | 'self-study' | 'experimental' // 課程類型：普通課/自習課/實驗課
}

/** 星期标签项 */
export interface IWeekTab {
  id: number
  label: string
  value: number
}

/** 成就項目 */
export interface IAchievementItem {
  id: number | string
  status: 'completed' | 'pending' | 'in-progress' // 已達成/未達成/主進度
  title: string // 成就標題
  description: string // 成就描述
  achievedTime?: string // 達成時間，格式：2025年1月2日 08:22:52
  category: string // 成就類別（年級成就/班級成就）
}
