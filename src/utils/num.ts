/** 格式化金额 */
export const formatAmount = (num: any): string => {
  // 确保是数字，空值转为 0
  const n = parseFloat(num) || 0;
  
  // toFixed(2) 保证了 0 变成 "0.00"
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};