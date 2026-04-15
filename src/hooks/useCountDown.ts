export const useCountDown = (options: { onTimeOut: () => void }) => {
  const countDown = ref()
  const timer = ref(null)

  const startCountDown = (_defaultCount: number = 60) => {
    countDown.value = _defaultCount
    timer.value = setInterval(() => {
      if (countDown.value <= 0) {
        clearInterval(timer.value)
        timer.value = null
        options.onTimeOut && options.onTimeOut()
        return
      }
      countDown.value--
    }, 1000) as unknown as number
  }

  const clearCountDown = () => {
    clearInterval(timer.value)
    timer.value = null
  }

  return { countDown, timer, startCountDown, clearCountDown }
}
