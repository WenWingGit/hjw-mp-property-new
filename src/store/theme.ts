import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ThemeColorConfigEnum, ThemeConfigEnum } from '@/theme'

const ThemeStoreKey = 'ThemeStore'

export const useThemeStore = defineStore(
  ThemeStoreKey,
  () => {
    // 当前主题名称
    const themeName = ref<ThemeConfigEnum>(ThemeConfigEnum.DEDAULT)

    /** 设置主题名称 */
    const setThemeName = (name: ThemeConfigEnum) => {
      themeName.value = name
    }

    /** 当前主题颜色 */
    const curThemeColor = computed(() => {
      return ThemeColorConfigEnum[themeName.value]
    })

    return {
      curThemeColor,
      themeName,
      setThemeName,
    }
  },
  {
    persist: true,
  },
)
