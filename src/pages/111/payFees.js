// pages/payFees/payFees.js
import { $tips, Router } from '../../../utils/common'
import { showAlert, showDialog } from '../../../utils/setDialog'
import { $, getDomRect } from '../../../utils/dom'
import { HouseWalletLogApi } from '../../../api/houseWalletLog'
import { getPropertyAmountListApi } from '../../../api/rechargeAmount'
import { getHouseWalletBalanceApi } from '../../../api/house'
import { submitPropertyRechargeApi } from '../../../api/rechargeApply'
import { divide, formatMoney } from '../../../utils/num'
import { getQrCodeApi } from '../../../api/webUser'
import { fullUrl } from '../../../utils/utils'
import { SCAN_PAY_URL } from '../../../config/config'

Router({
  is_can_share: true,

  data: {
    wallet_balance_wrap_height: '0px',

    selected_amount: null,
    is_loading: false,
    amount_list: [],
    is_select_custom_amount: false,
    custom_amount: '',
    canPay: false,

    is_show_pay_popup: false,

    is_agree: false,

    // 支付二维码
    pay_qrcoder_url: '',

    is_show_comfirm_pay_popup: false,
    total_balance: 0,

    paySteps: [
      '长按保存收款码',
      '打开微信扫一扫',
      '从相册选择刚保存的收款码',
      '完成支付后点击【我已支付】'
    ],
  },

  async onLoad () {
    this.getPropertyAmountList()
    this.getQrCode()
  },
  async getQrCode() {
    const [err, res] = await getQrCodeApi()
    if (!err) {
      this.setData({
        pay_qrcoder_url: fullUrl(res.qrCodeUrl)
      })
    }

  },

  async onShow () {
    this.getHouseWalletBalance()
  },

  onReady () {
    getDomRect('.wallet-balance-wrap').then(res => {
      let height = res?.height || 0
      this.setData({
        wallet_balance_wrap_height: height + 'px'
      })
    })
  },

  // 获取物业钱包余额
  async getHouseWalletBalance () {
    const [err, res] = await getHouseWalletBalanceApi()
    if (!err) {
      let count = res?.propertyWallet ?? 0
      this.setData({
        total_balance: formatMoney(divide(count, 100))
      })
    }
  },

  // 获取物业缴费金额列表
  async getPropertyAmountList () {
    const [err, res] = await getPropertyAmountListApi()
    if (!err && Array.isArray(res)) {
      const list = res.map(item => ({ value: item.amount / 100, id: item.id }))
      this.setData({
        amount_list: list
      })
    }
  },


  // 选择金额
  handleSelectAmount (e) {
    let { amount } = this.$data(e);
    this.setData({
      selected_amount: amount,
      is_select_custom_amount: false,
      custom_amount: '',
      canPay: true
    });
  },

  handleCustomAmount (e) {
    const value = e.detail.value;
    this.setData({
      selected_amount: '',
      custom_amount: value,
      canPay: !!value && !isNaN(value) && parseFloat(value) > 0
    });
  },

  handleSelectCustomAmount(e) {
    this.setData({
      selected_amount: '',
      is_select_custom_amount: true,
    })
  },

  async handleShowPayComfirmPopup () {
    let { selected_amount, custom_amount, amount_list } = this.data
    const amount = selected_amount || custom_amount;
    if (!amount) {
      this.$tips('请选择或输入缴费金额')
      return;
    }

    this.setData({
      is_show_comfirm_pay_popup: true
    })
  },

  async handleConfirmPay () {
    if (!this.data.is_agree) {
      $tips('请同意服务协议')
      return
    }
    let { selected_amount, custom_amount, amount_list } = this.data
    const amount = selected_amount || custom_amount;
    if (!amount) {
      this.$tips('请选择或输入缴费金额')
      return;
    }

    const params = {
      rechargeAmountSettingId: 0,
      customAmount: ''
    }

    if (selected_amount) {
      const cur_amount_item = amount_list.find(item => item.value === selected_amount)
      params.rechargeAmountSettingId  = cur_amount_item.id
    } else if (custom_amount) {
      params.customAmount = custom_amount
    }

    const [err, res] = await submitPropertyRechargeApi(params)
    if (err) {
      return 
    }
    this.setData({
      is_show_comfirm_pay_popup: false,
      is_show_pay_popup: true
    })
  },

  // 我已支付
  async handleHavePaid() {
    this.setData({
      is_show_pay_popup: false,
    })
    await showAlert({
      title: '处理成功',
      content: '已缴费待确认',
    })
  },

  handleNavToScanPay () {
    this.$nav('/pages/webView/webView', {
      url: encodeURIComponent(SCAN_PAY_URL),
      openAfterBack: '1',
    })
  },

  onHide () { },

  onUnload () { },

  onPullDownRefresh () { },

  onReachBottom () { },

  onShareAppMessage () { },


})