const imgExts = [
  '.jpg',
  '.png',
  '.jpeg',
  '.gif',
  '.webp',
  '.bmp',
  '.tiff',
  '.ico',
  '.heic',
  '.heif',
]

const pdfExts = ['.pdf']

const videoExts = ['mp4', 'mov', 'avi', 'mkv']

export function checkFileType(url: string, exts: string[]): boolean {
  if (typeof url !== 'string') {
    return false
  }
  if (!url) {
    return false
  }
  return exts.some((ext) => url.toLowerCase().endsWith(ext))
}

/**
 * 是否是图片
 * @param url 文件路径
 * @returns 是否是图片
 */
export function isImg(url: string): boolean {
  return checkFileType(url, imgExts)
}

/**
 * 是否是pdf
 * @param url 文件路径
 * @returns 是否是pdf
 */
export function isPdf(url: string): boolean {
  return checkFileType(url, pdfExts)
}

export function isVideo(url: string): boolean {
  return checkFileType(url, videoExts)
}
