import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type ISaveLoginInfo } from '@/typings'
import { LoginAccountCacheKey } from './storeName'

const initState: ISaveLoginInfo[] = [{ account: '', password: '' }]

export const useSaveLoginAccountStore = defineStore(
  LoginAccountCacheKey,
  () => {
    const saveLoginInfo = ref<ISaveLoginInfo[]>([...initState])
    const isAgree = ref<boolean>(false)

    const onChangeAgree = (agree: boolean) => {
      isAgree.value = agree
    }

    const saveAccountInfo = (accountInfo: ISaveLoginInfo) => {
      saveLoginInfo.value = saveLoginInfo.value.map((item) => {
        return {
          ...item,
          ...accountInfo,
        }
      })
    }

    const removeAccountInfo = () => {
      saveLoginInfo.value = saveLoginInfo.value.map((item) => {
        return item
      })
    }

    return {
      saveLoginInfo,
      saveAccountInfo,
      removeAccountInfo,
      isAgree,
      onChangeAgree,
    }
  },
  {
    persist: true,
  },
)
