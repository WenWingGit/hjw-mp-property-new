import { $hideLoading, $showLoading, $tips } from '@/utils/common'
import { ref, computed } from 'vue'

export function useSendCode(getCaptchaApi: any) {
  // 验证码
  const code = ref('')
  // 倒计时
  const timer = ref(0)
  // 是否正在发送
  const isSending = ref(false)
  // 定时器
  let interval: any = null

  // 获取验证码按钮文案
  const getCodeText = computed(() => {
    if (timer.value > 0) {
      return `${timer.value}秒后重新获取`
    }
    return isSending.value ? '发送中...' : '获取验证码'
  })

  // 发送验证码
  const handleGetCode = async (
    phone: string,
    valiFn: () => Promise<{ success: boolean; message: string }>,
  ) => {
    if (timer.value > 0 || isSending.value) return

    // 校验手机号
    if (!phone) {
      uni.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      uni.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      })
      return
    }

    if (typeof valiFn === 'function') {
      const { success, message } = await valiFn()
      if (!success) {
        $tips(message)
        return
      }
    }

    try {
      isSending.value = true

      uni.login({
        provider: 'weixin',
        success: async (res) => {
          console.log(res)
          $showLoading()
          try {
            await getCaptchaApi({ phone, wxCode: res.code })
          } catch (error) {
            console.log('出错了')
          } finally {
            $hideLoading()
          }

          // 开始倒计时
          handleCountDown()

          uni.showToast({
            title: '验证码发送成功',
            icon: 'none',
          })
        },
      })
    } catch (error) {
      console.error('发送验证码失败:', error)
      uni.showToast({
        title: '发送失败,请重试',
        icon: 'none',
      })
    } finally {
      isSending.value = false
    }
  }

  // 倒计时
  const handleCountDown = () => {
    clearInterval(interval)
    timer.value = 60
    interval = setInterval(() => {
      if (timer.value <= 0) {
        clearInterval(interval)
        return
      }
      timer.value--
    }, 1000)
  }

  // 清理定时器
  const clear = () => {
    clearInterval(interval)
    timer.value = 0
    isSending.value = false
  }

  return {
    code,
    timer,
    isSending,
    getCodeText,
    handleGetCode,
    clear,
  }
}
