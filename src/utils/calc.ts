/**
 * 浮点数加法，解决精度问题
 * @param a 加数1
 * @param b 加数2
 * @returns 和
 */
export function FloatAdd(a: number, b: number): number {
  let r1 = 0
  let r2 = 0
  let m = 0
  try {
    r1 = a.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = b.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (a * m + b * m) / m
}

/**
 * 浮点数减法，解决精度问题
 * @param a 被减数
 * @param b 减数
 * @returns 差
 */
export function FloatSdd(a: number, b: number): number {
  let r1 = 0
  let r2 = 0
  let m = 0
  try {
    r1 = a.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = b.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  const n = r1 >= r2 ? r1 : r2
  return Number(((a * m - b * m) / m).toFixed(n))
}
