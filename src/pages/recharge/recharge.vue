<route lang="json5">
{
  style: {
    navigationBarTitleText: '预缴物业费',
    hidesTabBar: true,
    navigationStyle: 'custom',
    navigationBarTextStyle: 'white',
  },
}
</route>
<template>
  <view class="recharge-page">
    <NavTopBar bg-color="#fff" title-color="#1a1a1a" btn-theme="black" title="预缴物业费" />

    <image class="page-top-bg" src="@/static/images/fee_top_bg.jpg" mode="widthFix" />

    <view class="wallet-balance-wrap">
      <view class="wallet-balance">钱包余额(元)</view>
      <view class="wallet-balance-amount">{{ total_balance }}</view>
    </view>

    <view class="fee-wrap">
      <view class="page-container">
        <view class="fee-item-title">选择缴费的金额(元)</view>

        <!-- 添加金额列表 -->
        <view class="amount-list">
          <view
            class="amount-item {{ selected_amount === item.value ? 'active' : '' }}"
            v-for="(item, index) in amount_list"
            :key="item.id"
            @click="handleSelectAmount(item)"
          >
            ¥{{ item.value }}
            <image
              v-if="selected_amount === item.value"
              class="icon-choosed"
              src="@/static/images/svg/a19.svg"
              mode="aspectFit"
            />
          </view>
        </view>

        <!-- 自定义金额输入框 -->
        <view class="custom-amount">
          <view class="custom-amount-title">自定义金额</view>
          <view
            class="input-wrap {{ is_select_custom_amount ? 'on' : '' }}"
            @click="handleSelectCustomAmount"
          >
            <text class="currency">金额</text>
            <input
              type="digit"
              class="amount-input"
              v-model="custom_amount"
              placeholder="请输入金额"
              maxlength="6"
              @input="handleCustomAmount"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 缴费记录 -->
    <view class="payment-record">
      <view @click="handleNavToPayRecord">充值记录</view>
      <view class="mx-30">|</view>
      <view @click="handleNavToPaymentRecord">支付记录</view>
    </view>

    <view class="bottom-bar">
      <view class="pay-btn" :disabled="!canPay" @click="handleShowPayComfirmPopup">立即支付</view>
    </view>

    <!-- 支付确认弹窗 -->
    <PagePopup v-model:visible="is_show_comfirm_pay_popup" title="缴费信息">
      <view class="custom-amount">
        <view class="input-wrap">
          <text class="currency">金额</text>
          <view class="amount-input flex items-center text-bold color-danger">
            <view>¥</view>
            <view>{{ custom_amount || selected_amount }}</view>
          </view>
          <view>元</view>
        </view>
      </view>

      <view class="flex mb-40 fz-26 my-30">
        <image
          v-if="!is_agree"
          class="icon-checkbox"
          src="@/static/images/svg/a48.svg"
          mode="aspectFit"
          @click="is_agree = true"
        />
        <image
          v-else
          class="icon-checkbox"
          src="@/static/images/svg/a47.svg"
          mode="aspectFit"
          @click="is_agree = false"
        />
        <view class="ml-10 flex-1 color-999" @click="is_agree = !is_agree">
          我已核实
          <text class="color-primary">收费人物业管理处、收费项目</text>
          的真实性，并阅读了
          <text @click="handleNavToAgreement" class="color-primary">《服务协议》</text>
          ，我同意支付费用。
        </view>
      </view>

      <template v-slot:footer>
        <view class="pb-30">
          <button class="confirm-btn" @click="handleConfirmPay">确认</button>
        </view>
      </template>
    </PagePopup>

    <!-- 支付弹窗 -->
    <PagePopup v-model:visible="is_show_pay_popup" title="缴费信息">
      <view class="fc flex-col pt-20">
        <image
          v-if="pay_qrcoder_url"
          class="qrcode-image"
          :src="pay_qrcoder_url"
          mode="aspectFit"
        />
      </view>

      <!-- 支付引导步骤 -->
      <view class="pay-guide">
        <view class="guide-title">支付步骤</view>
        <view class="guide-steps">
          <view class="step-item" v-for="(item, index) in paySteps" :key="index">
            <text class="step-number">{{ index + 1 }}.</text>
            <text class="step-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <template v-slot:footer>
        <view class="py-30 flex gap-30">
          <view class="flex-1">
            <button class="scan-btn" @click="handleNavToScanPay">扫一扫</button>
          </view>
          <view class="flex-1">
            <button class="paid-btn" @click="handleHavePaid">我已支付</button>
          </view>
        </view>
      </template>
    </PagePopup>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import NavTopBar from '@/components/applet/NavTopBar.vue'
import PagePopup from '@/components/common/PagePopup.vue'
import {
  getPropertyAmountListApi,
  submitPropertyRechargeApi,
  getQrCodeApi,
} from '@/service/common/common'
import { getHouseWalletBalanceApi } from '@/service/user'

import { formatMoney } from '@/utils/num'
import { SCAN_PAY_URL } from '@/configs/index'

const selected_amount = ref<number | null>(null)
const amount_list = ref<any[]>([
  {
    value: 200,
  },
  {
    value: 300,
  },
  {
    value: 400,
  },
])
const is_select_custom_amount = ref(false)
const custom_amount = ref('')
const canPay = ref(false)
const is_show_pay_popup = ref(false)
const is_agree = ref(false)
const pay_qrcoder_url = ref('')
const is_show_comfirm_pay_popup = ref(false)
const total_balance = ref('0.00')

const paySteps = [
  '长按保存收款码',
  '打开微信扫一扫',
  '从相册选择刚保存的收款码',
  '完成支付后点击【我已支付】',
]

// 获取物业钱包余额
const getHouseWalletBalance = async () => {
  const [err, res] = await getHouseWalletBalanceApi()
  if (!err) {
    const count = res?.propertyWallet ?? 0
    total_balance.value = formatMoney(count / 100)
  }
}

// 获取物业缴费金额列表
const getPropertyAmountList = async () => {
  const [err, res] = await getPropertyAmountListApi()
  if (!err && Array.isArray(res)) {
    const list = res.map((item) => ({ value: item.amount / 100, id: item.id }))
    amount_list.value = list
  }
}

// 获取二维码
const getQrCode = async () => {
  const [err, res] = await getQrCodeApi()
  if (!err) {
    pay_qrcoder_url.value = res.qrCodeUrl
  }
}

// 选择金额
const handleSelectAmount = (item: any) => {
  selected_amount.value = item.value
  is_select_custom_amount.value = false
  custom_amount.value = ''
  canPay.value = true
}

// 处理自定义金额
const handleCustomAmount = () => {
  selected_amount.value = null
  canPay.value =
    !!custom_amount.value &&
    !isNaN(Number(custom_amount.value)) &&
    parseFloat(custom_amount.value) > 0
}

// 选择自定义金额
const handleSelectCustomAmount = () => {
  selected_amount.value = null
  is_select_custom_amount.value = true
}

// 显示支付确认弹窗
const handleShowPayComfirmPopup = () => {
  const amount = selected_amount.value || custom_amount.value
  if (!amount) {
    uni.showToast({
      title: '请选择或输入缴费金额',
      icon: 'none',
    })
    return
  }
  is_show_comfirm_pay_popup.value = true
}

// 确认支付
const handleConfirmPay = async () => {
  if (!is_agree.value) {
    uni.showToast({
      title: '请同意服务协议',
      icon: 'none',
    })
    return
  }

  const amount = selected_amount.value || custom_amount.value
  if (!amount) {
    uni.showToast({
      title: '请选择或输入缴费金额',
      icon: 'none',
    })
    return
  }

  const params: any = {
    rechargeAmountSettingId: 0,
    customAmount: '',
  }

  if (selected_amount.value) {
    const cur_amount_item = amount_list.value.find((item) => item.value === selected_amount.value)
    params.rechargeAmountSettingId = cur_amount_item?.id || 0
  } else if (custom_amount.value) {
    params.customAmount = custom_amount.value
  }

  const [err, res] = await submitPropertyRechargeApi(params)
  if (!err) {
    is_show_comfirm_pay_popup.value = false
    is_show_pay_popup.value = true
  }
}

// 我已支付
const handleHavePaid = () => {
  is_show_pay_popup.value = false
  uni.showModal({
    title: '处理成功',
    content: '已缴费待确认',
    showCancel: false,
  })
}

// 导航到扫码支付
const handleNavToScanPay = () => {
  uni.navigateTo({
    url: `/pages/webView/webView?url=${encodeURIComponent(SCAN_PAY_URL)}&openAfterBack=1`,
  })
}

// 导航到充值记录
const handleNavToPayRecord = () => {
  uni.navigateTo({
    url: '/pages/rechargeRecord/rechargeRecord',
  })
}

// 导航到支付记录
const handleNavToPaymentRecord = () => {
  uni.navigateTo({
    url: '/pages/paymentRecord/paymentRecord',
  })
}

// 导航到服务协议
const handleNavToAgreement = () => {
  uni.navigateTo({
    url: '/pages/login/agreement/agreement',
  })
}

onMounted(async () => {
  await getPropertyAmountList()
  await getQrCode()
})

onShow(async () => {
  await getHouseWalletBalance()
})
</script>

<style lang="scss" scoped>
.recharge-page {
  min-height: 100vh;
  background-color: #fff;
}

.page-top-bg {
  position: absolute;
  top: 0;
  z-index: 1;
}

.wallet-balance-wrap {
  position: relative;
  z-index: 2;
  padding: 70rpx 30rpx 40rpx;
  color: #fff;

  .wallet-balance {
    margin-bottom: 16rpx;
    font-size: 28rpx;
  }

  .wallet-balance-amount {
    font-size: 64rpx;
    font-weight: bold;
  }
}

.fee-wrap {
  position: relative;
  z-index: 2;
  margin-top: -20rpx;
  background-color: #fff;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;

  .page-container {
    padding: 40rpx 32rpx;
  }

  .fee-item-title {
    margin-bottom: 32rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .amount-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin: 0 -10rpx 40rpx;

    .amount-item {
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc(33.33% - 10px);
      padding: 32rpx 0;
      background-color: #f8f9fb;
      border-radius: 16rpx;

      &.active {
        background-color: rgba(255, 153, 0, 0.05);
        border-color: var(--primary-color);
      }

      .icon-choosed {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 50rpx;
        height: 50rpx;
      }
    }
  }

  .custom-amount {
    margin-bottom: 40rpx;

    .custom-amount-title {
      margin-bottom: 16rpx;
      font-size: 28rpx;
      color: #666;
    }

    .input-wrap {
      display: flex;
      align-items: center;
      padding: 24rpx 32rpx;
      background-color: #f8f9fb;
      border-radius: 16rpx;

      &.on {
        border-color: var(--primary-color);
      }

      .currency {
        margin-right: 16rpx;
        font-size: 32rpx;
        color: #333;
      }

      .amount-input {
        flex: 1;
        font-size: 32rpx;
        color: #333;
        text-align: right;
      }
    }
  }
}

.payment-record {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 0;

  & > view {
    font-size: 28rpx;
    color: #666;
  }

  .mx-30 {
    margin: 0 30rpx;
  }
}

.bottom-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  padding: 24rpx 32rpx;
  background-color: #fff;
  border-top: 2rpx solid #f0f0f0;

  .pay-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 96rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
    background-color: var(--primary-color);
    border: none;
    border-radius: 48rpx;
  }
}

.qrcode-image {
  align-self: center;
  width: 268rpx;
  height: 268rpx;
  margin-bottom: 32rpx;
}

.pay-guide {
  margin-top: 20rpx;

  .guide-title {
    margin-bottom: 16rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .guide-steps {
    .step-item {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;

      .step-number {
        margin-right: 12rpx;
        font-size: 24rpx;
        color: #666;
      }

      .step-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.confirm-btn {
  width: 690rpx;
  height: 88rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #fff;
  background-color: var(--primary-color);
  border: none;
  border-radius: 44rpx;
}

.scan-btn {
  width: 100%;
  height: 88rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #fff;
  background-color: #07c160;
  border: none;
  border-radius: 44rpx;
}

.paid-btn {
  width: 100%;
  height: 88rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #fff;
  background-color: var(--primary-color);
  border: none;
  border-radius: 44rpx;
}

.icon-checkbox {
  width: 42rpx;
  height: 42rpx;
  margin-right: 10rpx;
}

.gap-30 {
  gap: 30rpx;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.flex-1 {
  flex: 1;
}

.ml-10 {
  margin-left: 10rpx;
}

.mb-40 {
  margin-bottom: 40rpx;
}

.my-30 {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}

.pb-30 {
  padding-bottom: 30rpx;
}

.py-30 {
  padding-top: 30rpx;
  padding-bottom: 30rpx;
}

.pt-20 {
  padding-top: 20rpx;
}

.fz-26 {
  font-size: 26rpx;
}

.text-bold {
  font-weight: bold;
}

.color-danger {
  color: #ff4d4f;
}

.color-primary {
  color: var(--primary-color);
}

.color-999 {
  color: #999;
}

.fc {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
