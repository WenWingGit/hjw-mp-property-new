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
export const createPaymentRecordApi = (params: any) => {
  return http.get<any>('/api/admin/payment-record/wecaht', params)
}
