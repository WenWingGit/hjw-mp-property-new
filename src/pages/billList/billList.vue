<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '缴物业费',
  },
}
</route>

<template>
  <view class="page">
    <PageNavBar id="page-nav-bar-wrapper" title="缴物业费" :z-index="999" show-back>
      <!-- <template #right>
        <text class="nav-right-text" @click="goToMyBills">我的账单</text>
      </template> -->
    </PageNavBar>

    <view id="page-filter" class="filter-bar">
      <view class="filter-item">
        <text class="filter-text">{{ dateRangeText }}</text>
        <view v-if="dateRangeText === '全部日期'" class="triangle-down"></view>
        <view v-else class="date-close-icon" @click.stop="onDateReset">
          <AppIcon icon="icon-close-solid" />
        </view>
        <wd-calendar
          class="calendar-picker"
          label=""
          :z-index="999"
          type="daterange"
          :max-date="today.getTime()"
          v-model="defaultDateRange"
          @confirm="onDateConfirm"
        />
      </view>
      <view class="filter-item">
        <text class="filter-text">{{ currentStatusLabel }}</text>
        <view class="triangle-down"></view>
        <wd-picker
          class="status-picker"
          :model-value="pageQuery.status"
          :z-index="999"
          :columns="statusOptions"
          label=""
          @confirm="onStatusConfirm"
        />
      </view>
    </view>

    <scroll-view
      scroll-y
      :style="{
        height: 'calc(100vh - ' + outScrollHeight + ')',
      }"
      class="list-container"
      :refresher-threshold="70"
      refresher-background="#f8f8f8"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshLoading"
      @scrolltolower="onLoadMore"
      @refresherrefresh="onRefresh"
    >
      <view class="page-container sx-py-15">
        <view class="bill-card" v-for="(item, index) in list" :key="item.id">
          <view class="card-header">
            <view class="card-title">
              <text>{{ item.itemName }}：</text>
              <text class="title-price">¥{{ item.billAmount }}</text>
            </view>
            <wd-checkbox
              v-if="item.showCheckBox"
              v-model="item.checked"
              checked-color="#ff8c00"
              shape="square"
              custom-class="custom-checkbox"
            ></wd-checkbox>
          </view>

          <view class="card-info">
            <view class="info-line">
              缴费小区：{{ item.communityName }} | {{ item.propertyNo }}
            </view>
            <view class="info-line">账单时间：{{ item.createTime }}</view>
            <view class="info-line">
              账单状态：
              <text class="status-text">{{ BillPayStatusValueEnum[item.status] }}</text>
            </view>
          </view>

          <view v-if="item.lateFeeAmount" class="fee-detail-box">
            <view class="fee-row">
              <text class="fee-label">滞纳金金额：</text>
              <text class="fee-value">¥{{ item.lateFeeAmount }}</text>
            </view>
          </view>

          <!-- 已缴费才显示 -->
          <view class="fee-footer">
            <wd-button size="small" type="primary" @click="onCreateCertificate(item)">
              生成电子凭证
            </wd-button>
          </view>
        </view>

        <ListMore
          :params="{
            isLoading: pageInfo.isLoading,
            isNoMore: !pageInfo?.hasNextPage,
            isEmpty: list.length === 0,
          }"
          empty-text="账单为空"
        />
      </view>
    </scroll-view>

    <view id="bottom-bar" class="bottom-bar">
      <view class="left-section">
        <view class="total-line">
          <text class="total-label">合计：</text>
          <text class="total-price">¥{{ selectedTotalPrice }}</text>
        </view>
        <view v-if="myWalletInfo" class="wallet-balance">
          钱包余额：¥{{ formatMoney(myWalletInfo?.balance || 0) }}
        </view>
      </view>
      <view class="right-section">
        <button class="pay-btn" :class="{ disabled: selectedTotalPrice <= 0 }" @click="handlePay">
          立即支付
        </button>
      </view>
    </view>

    <wd-popup
      v-model="showPayPopup"
      position="bottom"
      :z-index="999"
      custom-style="border-radius: 24rpx 24rpx 0 0; overflow: hidden;"
    >
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">缴费信息</text>
          <view class="close-icon" @click="showPayPopup = false">
            <wd-icon name="close" size="20px" color="#999" />
          </view>
        </view>

        <scroll-view scroll-y class="popup-scroll">
          <view class="popup-summary">
            费用汇总：
            <text>¥{{ propertyTotal }}</text>
          </view>

          <view class="popup-detail-box" v-for="(item, index) in selectedBills" :key="item.id">
            <view class="fee-row">
              <text class="fee-label">{{ item.itemName }}：</text>
              <text class="fee-value">¥{{ item.billAmount }}</text>
            </view>
          </view>

          <view class="agreement-box">
            <wd-checkbox v-model="isAgreed" checked-color="#ff8c00" size="16px"></wd-checkbox>
            <text class="agreement-text">
              我已核实收费人物业管理处、收费项目的真实性，并阅读了《服务协议》，我同意支付费用。
            </text>
          </view>
        </scroll-view>

        <view class="popup-bottom-bar">
          <view class="left-section">
            <view class="total-line">
              <text class="total-label">合计：</text>
              <text class="total-price">¥{{ finalTotal }}</text>
            </view>
            <view class="wallet-balance">
              钱包余额：¥{{ formatMoney(myWalletInfo?.balance || 0) }}
            </view>
          </view>
          <view class="right-section">
            <button class="pay-btn" :class="{ disabled: !isAgreed }" @click="confirmPay">
              立即支付
            </button>
          </view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDomRect } from '@/hooks/useDomRect'
import useLoadPageList from '@/hooks/useLoadPageList'
import ListMore from '@/components/common/ListMore.vue'
import BuyBar from '@/components/swim/BuyBar.vue'

// 默认选中今年1月1日到今天
import dayjs from 'dayjs'
import { useMessage } from 'wot-design-uni'
import { getBillListApi, createPaymentRecordApi, myWalletApi } from '@/service/bill'
import { useLoginStore } from '@/store'
import { storeToRefs } from 'pinia'
import { BillPayStatusEnum, BillPayStatusValueEnum } from '@/enum/billPayStatusEnum'
import { formatMoney } from '@/utils/num'

const message = useMessage()

// 筛选状态
const dateRangeText = ref('全部日期')
const currentStatusLabel = ref('待缴费')
const thisYear = dayjs().year()
const today = dayjs().toDate()
const defaultDateRangeValue = [dayjs(`${thisYear}-01-01`).toDate(), today]

// 日期范围
const defaultDateRange = ref(defaultDateRangeValue)

// 状态选择器数据
const statusOptions = ref([
  { label: '全部状态', value: 0 },
  { label: '待缴费', value: BillPayStatusEnum.Pending },
  { label: '已缴费', value: BillPayStatusEnum.Paid },
])

// 滚动内容以外的高度
const { allRect: outScrollHeight } = useDomRect(
  ['#page-nav-bar-wrapper', '#page-filter', '#bottom-bar'],
  'height',
)

const loginStore = useLoginStore()
const { loginInfo } = storeToRefs(loginStore)

// 使用useLoadPageList钩子
const {
  list,
  pageQuery,
  pageInfo,
  listStatus,
  getList,
  onInitList,
  onRefresh,
  onLoadMore,
  isRefreshLoading,
} = useLoadPageList(
  getBillListApi,
  {
    page: 1,
    limit: 10,
    // 状态
    status: 0,
    // 开始日期
    startTimeStart: '',
    //  || defaultDateRange.value[0],
    // 结束日期
    endTimeEnd: '',
    // || defaultDateRange.value[1],
    ownerId: loginInfo.value?.userInfo?.id,
  },
  {
    isAutoLoad: true,
    loadBefore: (pageQuery) => {
      const _pageQuery = { ...pageQuery }
      if (_pageQuery.startTimeStart) {
        _pageQuery.startTimeStart = dayjs(_pageQuery.startTimeStart).format('YYYY-MM-DD')
      }
      if (_pageQuery.endTimeEnd) {
        _pageQuery.endTimeEnd = dayjs(_pageQuery.endTimeEnd).format('YYYY-MM-DD')
      }
      return _pageQuery
    },
    loadedCallBack: (resList) => {
      return (resList || []).map((item: any) => {
        return {
          ...item,
          showCheckBox: item.status == BillPayStatusEnum.Pending,
          checked: false,
        }
      })
    },
  },
)

onLoad(() => {
  onLoadMyWallet()
})

// 格式化日期
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 日期确认处理
const onDateConfirm = (value: any) => {
  const [startDate, endDate] = value?.value || []
  if (startDate && endDate) {
    const startStr = formatDate(new Date(startDate), 'YYYY-MM-DD')
    const endStr = formatDate(new Date(endDate))
    dateRangeText.value = `${startStr}-${endStr}`
    pageQuery.startTimeStart = startStr
    pageQuery.endTimeEnd = endStr
    onInitList()
  }
}

const onDateReset = () => {
  defaultDateRange.value = defaultDateRangeValue
  dateRangeText.value = '全部日期'
  pageQuery.startTimeStart = ''
  pageQuery.endTimeEnd = ''
  onInitList()
}

// 状态确认处理
const onStatusConfirm = (res: any) => {
  const { label, value } = res.selectedItems
  currentStatusLabel.value = label
  pageQuery.status = value
  onInitList()
}

// 计算选中的总价
const selectedTotalPrice = computed(() => {
  const total = list.value
    .filter((item: any) => item.checked)
    .reduce((sum: number, item: any) => sum + Number(item.billAmount), 0)
  return total.toFixed(2)
})

// 选中的账单
const selectedBills = computed(() => {
  return list.value.filter((item: any) => item.checked)
})

// 物业费用总计
const propertyTotal = computed(() => {
  return selectedTotalPrice.value
})

// 最终总计
const finalTotal = computed(() => {
  return selectedTotalPrice.value
})

// 导航事件
// const goToMyBills = () => {
//   uni.navigateTo({ url: '/pages/property/my-bills' })
// }

// 支付事件
const handlePay = () => {
  if (selectedTotalPrice.value <= 0) {
    uni.showToast({ title: '请先选择账单', icon: 'none' })
    return
  }
  openPayPopup()
}

// 弹窗状态
const showPayPopup = ref(false)
const isAgreed = ref(false)

// 打开弹窗
const openPayPopup = () => {
  if (Number(finalTotal.value) <= 0) {
    uni.showToast({ title: '请先选择账单', icon: 'none' })
    return
  }
  showPayPopup.value = true
}

// 确认支付
const confirmPay = async () => {
  if (!isAgreed.value) {
    uni.showToast({ title: '请先阅读并同意服务协议', icon: 'none' })
  }
  // uni.showToast({
  //   title: '支付功能待完成',
  //   icon: 'none',
  // })

  const res = await createPaymentRecordApi({
    paymentPurpose: 0,
    billId: selectedBills.value[0].id,
    amount: parseFloat(propertyTotal.value),
    walletId: myWalletInfo.value?.id,
    payer: 'oLTQ85Ef7PDBu_LgtESzW6E4Uqpc',
    lateFeeAmount: 0,
    prepaidDeduction: 0,
    // paymentTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  if (res?.code === '0000') {
  }
}

const onCreateCertificate = () => {
  message.alert('生成成功').then(() => {})
}

const myWalletInfo = ref()
const onLoadMyWallet = async () => {
  const res = await myWalletApi({
    userId: loginInfo.value?.userInfo?.id,
  })
  if (res?.data?.rows?.length) {
    const myWallet = res?.data?.rows.find((item) => item.userId === loginInfo.value?.userInfo?.id)
    if (myWallet) {
      myWalletInfo.value = myWallet
    }
  }
}
</script>

<style lang="scss" scoped>
/* 页面容器 */
.page {
  background-color: #f5f6f8; /* 还原背景灰白色 */
}
/* 导航栏右侧文字 */
.nav-right-text {
  font-size: 28rpx;
  color: #333;
}
/* 筛选栏 */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 90rpx;
  background-color: #ffffff;
  box-shadow: 0rpx 1rpx 20rpx 2rpx #e5e5e5;

  .filter-item {
    position: relative;
    display: flex;
    flex: 1;
    gap: 8rpx;
    align-items: center;
    justify-content: center;
    height: 100%;

    .filter-text {
      font-size: 26rpx;
      color: #333;
    }

    .triangle-down {
      width: 0;
      height: 0;
      margin-top: 4rpx;
      border-top: 10rpx solid #333;
      border-right: 8rpx solid transparent;
      border-left: 8rpx solid transparent;
    }

    .date-close-icon {
      position: relative;
      z-index: 9999;
    }
  }
}
/* 列表区 */
.list-container {
  box-sizing: border-box;
  overflow: hidden;
}

.bill-card {
  padding: 32rpx;
  background-color: #ffffff;
  border-radius: 16rpx;

  & + & {
    margin-top: 24rpx;
  }
  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .card-title {
      flex: 1;
      font-size: 32rpx;
      font-weight: bold;
      line-height: 1.4;
      color: #1a1a1a;

      .title-price {
        margin-left: 4rpx;
      }
    }

    :deep(.custom-checkbox) {
      margin-top: 4rpx;
      margin-left: 20rpx;
    }
  }

  .card-info {
    margin-bottom: 24rpx;
    font-size: 26rpx;
    line-height: 1.8;
    color: #999999;

    .status-text {
      color: #999999; /* 根据设计图，待缴费也是灰色 */
    }
  }

  .fee-detail-box {
    padding: 24rpx;
    background-color: #f8f9fa;
    border-radius: 12rpx;

    .fee-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16rpx;
      font-size: 26rpx;
      color: #666666;

      &:last-child {
        margin-bottom: 0;
      }

      .fee-value {
        color: #666666;
      }
    }
  }

  .fee-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 24rpx;
  }
}
/* 底部结算栏 */
.bottom-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
  background-color: #ffffff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.04);

  .left-section {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .total-line {
      display: flex;
      align-items: baseline;
      margin-bottom: 4rpx;

      .total-label {
        font-size: 30rpx;
        font-weight: bold;
        color: #333333;
      }

      .total-price {
        font-size: 36rpx;
        font-weight: bold;
        color: #eb3223; /* 设计图中的红色 */
      }
    }

    .wallet-balance {
      font-size: 22rpx;
      color: #999999;
    }
  }

  .right-section {
    .pay-btn {
      width: 240rpx;
      height: 80rpx;
      padding: 0;
      margin: 0;
      font-size: 30rpx;
      font-weight: 500;
      line-height: 80rpx;
      color: #ffffff;
      text-align: center;
      background: #ff8c00; /* 橙色按钮 */
      border-radius: 40rpx;

      &::after {
        border: none;
      }

      &.disabled {
        color: #ffffff;
        background: #cccccc;
      }
    }
  }
}
/* ================= 弹窗专属样式 ================= */
.popup-container {
  display: flex;
  flex-direction: column;
  height: 65vh; /* 弹窗高度限制 */
  background-color: #ffffff;
}

.popup-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .popup-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .close-icon {
    position: absolute;
    top: 50%;
    right: 32rpx;
    padding: 10rpx;
    transform: translateY(-50%);
  }
}

.popup-scroll {
  box-sizing: border-box;
  flex: 1;
  padding: 32rpx;
}

.popup-summary {
  margin-bottom: 24rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #1a1a1a;
}

.popup-detail-box {
  padding: 24rpx;
  margin-bottom: 24rpx;
  background-color: #f8f9fa;
  border-radius: 12rpx;

  .fee-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
    font-size: 26rpx;
    color: #666666;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.agreement-box {
  display: flex;
  margin-top: 10rpx;
  margin-bottom: 40rpx;

  :deep(.wd-checkbox) {
    display: flex;
    align-items: flex-start;
    min-width: 40rpx;
  }

  :deep(.wd-checkbox__shape) {
    transform: translateY(10rpx);
  }
  :deep(.wd-checkbox__label) {
    flex: 1;
    margin-left: 16rpx;
    line-height: 1.5;
  }

  .agreement-text {
    flex: 1;
    font-size: 24rpx;
    color: #999999;
  }
}
/* 弹窗底部支付栏（样式复用页面底部的结构） */
.popup-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
  background-color: #ffffff;
  border-top: 1rpx solid #f0f0f0;

  .left-section {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .total-line {
      display: flex;
      align-items: baseline;
      margin-bottom: 4rpx;

      .total-label {
        font-size: 30rpx;
        font-weight: bold;
        color: #333333;
      }

      .total-price {
        font-size: 36rpx;
        font-weight: bold;
        color: #eb3223;
      }
    }

    .wallet-balance {
      font-size: 22rpx;
      color: #999999;
    }
  }

  .right-section {
    .pay-btn {
      width: 240rpx;
      height: 80rpx;
      padding: 0;
      margin: 0;
      font-size: 30rpx;
      font-weight: 500;
      line-height: 80rpx;
      color: #ffffff;
      text-align: center;
      background: #ff8c00;
      border-radius: 40rpx;

      &::after {
        border: none;
      }

      &.disabled {
        color: #ffffff;
        background: #ffc073; /* 禁用状态的橙色变浅 */
      }
    }
  }
}

.status-picker {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  :deep(.wd-picker__cell) {
    opacity: 0;
  }
}
:deep(.wd-picker__cell),
:deep(.wd-calendar__cell) {
  position: absolute !important;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
  opacity: 0;
}

:deep(.wd-month__day.is-middle .wd-month__day-container) {
  background-color: #fff6ec !important;
}

:deep(.wd-month__day.is-end .wd-month__day-container),
:deep(.wd-month__day.is-start .wd-month__day-container),
:deep(.wd-month__day.is-start::after) {
  background-color: #ff8c00 !important;
}
</style>
