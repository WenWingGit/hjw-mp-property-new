// src/hooks/useImageData.ts
import { ref, UnwrapRef, Ref } from 'vue'

const _baseUrl = import.meta.env.VITE_SERVER_BASEURL

// 上传图片项的数据结构
export interface IImageItem {
  relativeUrl: string // 相对路径，用于提交给接口
  url?: string // 完整路径，用于显示
  absoluteUrl?: string // 完整路径，用于显示（与url相同）
  name?: string // 文件名
  size?: number // 文件大小
  [key: string]: any // 其他可能的属性
}

// 接口返回的图片数据类型
export type ApiImageValue = string | string[] | IImageItem | IImageItem[]

// 内部统一使用的图片数据类型
export type ImageFieldValue = IImageItem[]

// 定义每个字段的输出格式
export type FieldFormat = 'string' | 'array' | 'first'

// 修改这里：添加类型约束确保 T 的所有值都是 ImageFieldValue 类型
export function useImageData<T extends { [K in keyof T]: ImageFieldValue }>(
  options: {
    initialData?: Partial<Record<keyof T, ApiImageValue>>
    baseUrl?: string // 基础URL，用于转换相对路径到完整路径
    fieldFormats?: Partial<Record<keyof T, FieldFormat>> // 每个字段的输出格式配置
  } = {},
) {
  const { baseUrl = _baseUrl, fieldFormats = {} } = options

  // 创建一个空的初始数据对象
  const emptyData = {} as { [K in keyof T]: ImageFieldValue }

  // 将初始数据标准化为 IImageItem[] 格式
  const normalizedData = normalizeInitialData(options.initialData || {})
  const imageData = ref<T>({ ...emptyData, ...normalizedData } as T)

  /**
   * 标准化初始数据
   */
  function normalizeInitialData(data: Record<string, ApiImageValue>) {
    const result = {} as Record<string, ImageFieldValue>

    Object.entries(data).forEach(([key, value]) => {
      result[key] = convertToImageItems(value)
    })

    return result
  }

  /**
   * 将各种可能的输入转换为标准的 IImageItem[] 格式
   */
  function convertToImageItems(value: ApiImageValue): IImageItem[] {
    if (!value) return []

    if (typeof value === 'string') {
      // 处理逗号分隔的字符串
      return value
        .split(',')
        .filter(Boolean)
        .map((url) => ({
          relativeUrl: url,
          url: baseUrl + url, // 添加 url
          absoluteUrl: baseUrl + url, // 保持 absoluteUrl
        }))
    }

    if (Array.isArray(value)) {
      return value.map((item) => {
        if (typeof item === 'string') {
          return {
            relativeUrl: item,
            url: baseUrl + item, // 添加 url
            absoluteUrl: baseUrl + item, // 保持 absoluteUrl
          }
        }
        return {
          ...item,
          url: item.url || baseUrl + item.relativeUrl, // 添加 url
          absoluteUrl: item.absoluteUrl || baseUrl + item.relativeUrl, // 保持 absoluteUrl
        }
      })
    }

    // 处理单个 IImageItem
    return [
      {
        ...value,
        url: value.url || baseUrl + value.relativeUrl, // 添加 url
        absoluteUrl: value.absoluteUrl || baseUrl + value.relativeUrl, // 保持 absoluteUrl
      },
    ]
  }

  /**
   * 更新单个字段的图片数据
   */
  const updateFieldImages = <K extends keyof T>(field: K, images: ApiImageValue) => {
    const converted = convertToImageItems(images)
    const data = imageData.value as { [key in keyof T]: ImageFieldValue }
    if (field) {
      data[field] = converted
    }
  }

  /**
   * 批量更新图片数据
   */
  const updateAllImages = (data: Partial<Record<keyof T, ApiImageValue>>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFieldImages(key as keyof T, value)
      }
    })
  }

  /**
   * 格式化单个字段的数据
   */
  function formatFieldValue<K extends keyof T>(
    field: K,
    value: IImageItem[],
    format: FieldFormat = 'string',
  ) {
    if (format === 'string') {
      return value.map((img) => img.relativeUrl).join(',')
    } else if (format === 'array') {
      return value.map((img) => img.relativeUrl)
    } else if (format === 'first') {
      return value[0]?.relativeUrl || ''
    }
    return value.map((img) => img.relativeUrl).join(',')
  }

  /**
   * 格式化数据用于提交到接口
   */
  const formatSubmitData = () => {
    const result: Record<string, any> = {}
    const data = imageData.value as { [key in keyof T]: ImageFieldValue }

    Object.entries(data).forEach(([key, value]) => {
      const format = fieldFormats[key as keyof T] || 'string'
      result[key] = formatFieldValue(key as keyof T, value, format)
    })

    return result
  }

  /**
   * 获取指定字段的完整路径数组
   */
  const getFieldAbsoluteUrls = <K extends keyof T>(field: K): string[] => {
    const data = imageData.value as { [key in keyof T]: ImageFieldValue }
    const value = data[field]
    return (value || []).map((item) => item.absoluteUrl || baseUrl + item.relativeUrl)
  }

  /**
   * 重置指定字段的数据
   */
  const resetField = <K extends keyof T>(field: K) => {
    const data = imageData.value as { [key in keyof T]: ImageFieldValue }
    data[field] = []
  }

  /**
   * 重置所有数据
   */
  const resetAllFields = () => {
    const data = imageData.value as { [key in keyof T]: ImageFieldValue }
    Object.keys(data).forEach((key) => {
      resetField(key as keyof T)
    })
  }

  /**
   * 解析接口返回的数据为上传组件所需格式
   * @param apiData 接口返回的数据
   */
  const parseDetailData = (apiData: Partial<Record<keyof T, string | string[]>>) => {
    const data = imageData.value as { [key in keyof T]: ImageFieldValue }

    Object.entries(apiData).forEach(([key, value]) => {
      if (value) {
        if (typeof value === 'string') {
          // 处理逗号分隔的字符串
          data[key as keyof T] = value
            .split(',')
            .filter(Boolean)
            .map((url) => ({
              relativeUrl: url,
              url: baseUrl + url,
              absoluteUrl: baseUrl + url,
              name: url.split('/').pop() || '',
            }))
        } else if (Array.isArray(value)) {
          // 处理字符串数组
          data[key as keyof T] = value.map((url) => ({
            relativeUrl: url,
            url: baseUrl + url,
            absoluteUrl: baseUrl + url,
            name: url.split('/').pop() || '',
          }))
        }
      } else {
        data[key as keyof T] = []
      }
    })
  }

  return {
    imageData,
    updateFieldImages,
    updateAllImages,
    formatSubmitData,
    getFieldAbsoluteUrls,
    resetField,
    resetAllFields,
    parseDetailData,
  }
}
