import { http } from '@/utils/http'

export const getBillListApi = (params: any) => {
  return http.get<any>('/api/admin/bill', params)
}

export const myWalletApi = (params: any) => {
  return http.get<any>('/api/admin/wallet', params)
}
