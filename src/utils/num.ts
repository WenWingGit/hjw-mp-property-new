/**
 * 数字处理工具库
 * @module NumberUtils
 */

/**
 * 将数字格式化为金额显示
 * @param {number} num - 要格式化的数字
 * @param {number} [decimals=2] - 保留小数位数
 * @param {string} [separator=','] - 千位分隔符
 * @returns {string} 格式化后的金额字符串
 */
export function formatMoney(num, decimals = 2, separator = ',') {
  if (typeof num !== 'number') return '0.00';
  
  const parts = num.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join('.');
}

/**
 * 数字千分位格式化
 * @param {number} num - 要格式化的数字
 * @param {string} [separator=','] - 分隔符
 * @returns {string} 格式化后的字符串
 */
export function formatThousands(num, separator = ',') {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * 保留指定位数的小数
 * @param {number} num - 要处理的数字
 * @param {number} [digits=2] - 保留的小数位数
 * @param {boolean} [round=true] - 是否四舍五入
 * @returns {number} 处理后的数字
 */
export function toFixed(num, digits = 2, round = true) {
  if (round) {
    return Number(Math.round(num + 'e' + digits) + 'e-' + digits);
  }
  return Number(Math.floor(num + 'e' + digits) + 'e-' + digits);
}

/**
 * 数字范围限制
 * @param {number} num - 要限制的数字
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的数字
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * 计算百分比
 * @param {number} part - 部分值
 * @param {number} total - 总值
 * @param {number} [decimals=2] - 保留小数位数
 * @returns {number} 百分比值
 */
export function percentage(part, total, decimals = 2) {
  if (total === 0) return 0;
  return toFixed((part / total) * 100, decimals);
}

/**
 * 数字加法（解决浮点数精度问题）
 * @param {number} num1 - 第一个数
 * @param {number} num2 - 第二个数
 * @returns {number} 相加结果
 */
export function add(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (num1 * baseNum + num2 * baseNum) / baseNum;
}

/**
 * 随机数生成
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {boolean} [isInteger=true] - 是否为整数
 * @returns {number} 随机数
 */
export function random(min, max, isInteger = true) {
  const num = Math.random() * (max - min) + min;
  return isInteger ? Math.floor(num) : num;
}

/**
 * 数字转中文大写
 * @param {number} num - 要转换的数字
 * @returns {string} 中文大写
 */
export function numberToChinese(num) {
  const units = ['', '万', '亿', '万亿'];
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const positions = ['', '十', '百', '千'];
  
  if (num === 0) return digits[0];
  
  const strNum = Math.floor(Math.abs(num)).toString();
  let result = '';
  let unit = 0;
  
  for (let i = strNum.length - 1; i >= 0; i -= 4) {
    let section = strNum.slice(Math.max(0, i - 3), i + 1);
    let sectionResult = '';
    
    for (let j = 0; j < section.length; j++) {
      const digit = parseInt(section[j]);
      if (digit !== 0) {
        sectionResult += digits[digit] + positions[section.length - 1 - j];
      } else {
        if (sectionResult.charAt(sectionResult.length - 1) !== digits[0]) {
          sectionResult += digits[0];
        }
      }
    }
    
    if (sectionResult) {
      result = sectionResult + (units[unit] || '') + result;
    }
    unit++;
  }
  
  result = result.replace(/零+$/, '').replace(/零+/g, '零');
  return num < 0 ? '负' + result : result;
}

/**
 * 数字减法（解决浮点数精度问题）
 * @param {number} num1 - 被减数
 * @param {number} num2 - 减数
 * @returns {number} 相减结果
 */
export function subtract(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (num1 * baseNum - num2 * baseNum) / baseNum;
}

/**
 * 数字乘法（解决浮点数精度问题）
 * @param {number} num1 - 第一个数
 * @param {number} num2 - 第二个数
 * @returns {number} 相乘结果
 */
export function multiply(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, num1Digits + num2Digits);
  return (num1 * Math.pow(10, num1Digits) * num2 * Math.pow(10, num2Digits)) / baseNum;
}

/**
 * 数字除法（解决浮点数精度问题）
 * @param {number} num1 - 被除数
 * @param {number} num2 - 除数
 * @param {number} [digits=2] - 保留小数位数
 * @returns {number} 相除结果
 * @throws {Error} 当除数为0时抛出错误
 */
export function divide(num1, num2, digits = 2) {
  if (num2 === 0) {
    throw new Error('除数不能为0');
  }
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  const result = (num1 * baseNum) / (num2 * baseNum);
  return toFixed(result, digits);
}

/**
 * 批量数字计算
 * @param {number[]} numbers - 要计算的数字数组
 * @param {'add'|'subtract'|'multiply'|'divide'} operation - 计算操作
 * @returns {number} 计算结果
 */
export function calculate(numbers, operation) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('请提供有效的数字数组');
  }

  return numbers.reduce((result, current, index) => {
    if (index === 0) return current;
    
    switch (operation) {
      case 'add':
        return add(result, current);
      case 'subtract':
        return subtract(result, current);
      case 'multiply':
        return multiply(result, current);
      case 'divide':
        return divide(result, current);
      default:
        throw new Error('不支持的计算操作');
    }
  });
}

/**
 * 数字转化为带单位的字符串（万、亿）
 * @param {number} num - 要转换的数字
 * @param {number} [digits=2] - 保留小数位数
 * @returns {string} 带单位的字符串
 */
export function formatUnit(num, digits = 2) {
  const units = [
    { value: 1e8, symbol: '亿' },
    { value: 1e4, symbol: '万' }
  ];
  
  for (let unit of units) {
    if (Math.abs(num) >= unit.value) {
      return (num / unit.value).toFixed(digits) + unit.symbol;
    }
  }
  return num.toString();
}

/**
 * 数字转化为带计数单位的字符串（k、M、B）
 * @param {number} num - 要转换的数字
 * @param {number} [digits=2] - 保留小数位数
 * @returns {string} 带单位的字符串
 */
export function formatMetricUnit(num, digits = 2) {
  const units = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' }
  ];
  
  for (let unit of units) {
    if (Math.abs(num) >= unit.value) {
      return (num / unit.value).toFixed(digits) + unit.symbol;
    }
  }
  return num.toString();
}

/**
 * 判断是否为有效数字
 * @param {any} value - 要判断的值
 * @returns {boolean} 是否为有效数字
 */
export function isValidNumber(value) {
  return typeof value === 'number' && // 检查是否为数字类型
         !isNaN(value) &&            // 检查是否不是 NaN
         isFinite(value);            // 检查是否是有限数
}

/**
 * 数字补零
 * @param {number} num - 要补零的数字
 * @param {number} [length=2] - 补零后的总长度
 * @returns {string} 补零后的字符串
 */
export function padZero(num, length = 2) {
  return String(num).padStart(length, '0');
}

/**
 * 数字转罗马数字
 * @param {number} num - 要转换的数字（1-3999）
 * @returns {string} 罗马数字
 */
export function toRoman(num) {
  if (!Number.isInteger(num) || num < 1 || num > 3999) {
    throw new Error('数字必须是1-3999之间的整数');
  }
  
  const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];
  
  let result = '';
  let remaining = num;
  
  for (let numeral of romanNumerals) {
    while (remaining >= numeral.value) {
      result += numeral.symbol;
      remaining -= numeral.value;
    }
  }
  
  return result;
}
