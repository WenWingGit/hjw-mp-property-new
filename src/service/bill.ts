import { http } from '@/utils/http'

export const getBillListApi = (params: any) => {
  return http.get<any>('/api/admin/bill', params, {
    hideErrorToast: true,
  })
}

export const myWalletApi = (params: any) => {
  return http.get<any>('/api/admin/wallet', params)
}

export const paymentRecordListApi = (params: any) => {
  return http.get<any>('/api/admin/payment-record', params)
}

/** 支付 */
export const h5unionorderApi = (params: any) => {
  return http.post<any>('/api/admin/payment-record/h5unionorder', params)
}
