<route lang="json5">
{
  style: {
    navigationBarTitleText: '充值记录',
    hidesTabBar: true,
    navigationStyle: 'custom',
    navigationBarTextStyle: 'white',
  },
}
</route>
<template>
  <view class="recharge-record-page">
    <NavTopBar
      id="page-nav-bar-wrapper"
      bg-color="#fff"
      title-color="#1a1a1a"
      btn-theme="black"
      title="充值记录"
    />

    <view id="gap" class="sx-pb-15"></view>

    <scroll-view
      :style="{ height: 'calc(100vh - ' + outScrollHeight + ')' }"
      scroll-y
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="handleRefresh"
      @scrolltolower="handleScrollToBottom"
    >
      <view class="page-container sx-pb-40">
        <view
          class="box-white sx-p-30 item-30"
          v-for="item in payRecordList"
          :key="item.id"
          @tap="onClickItem(item)"
        >
          <view class="flex justify-between items-center">
            <view class="record-title">充值金额：¥{{ item.amount }}</view>
            <view :class="['status', `status-${item.paymentStatus}`]">
              {{
                item.paymentStatus === '0'
                  ? '处理中'
                  : item.paymentStatus === '1'
                    ? '成功'
                    : item.paymentStatus === '2'
                      ? '失败'
                      : '未知'
              }}
            </view>
          </view>

          <view class="Infobox sx-p-30 sx-mt-30">
            <view class="record-text">
              <view>收款方：</view>
              <view>{{ item.payee || '暂无' }}</view>
            </view>

            <view class="record-text" v-if="item.payer">
              <view>付款方：</view>
              <view>{{ item.payer }}</view>
            </view>

            <view class="record-text">
              <view>支付用途：</view>
              <view>
                {{
                  item.paymentPurpose === '0'
                    ? '预存'
                    : item.paymentPurpose === '1'
                      ? '缴费'
                      : '其他'
                }}
              </view>
            </view>

            <view class="record-text">
              <view>创建时间：</view>
              <view>{{ item.createTime }}</view>
            </view>

            <view class="record-text" v-if="item.paymentTime">
              <view>支付时间：</view>
              <view>{{ item.paymentTime }}</view>
            </view>
          </view>

          <view
            v-if="item.paymentStatus === '2' && item.failReason"
            class="flex record-recevier sx-mt-30"
          >
            失败原因：{{ item.failReason }}
          </view>

          <view v-if="item.remark" class="flex record-recevier sx-mt-30">
            备注：{{ item.remark }}
          </view>
        </view>

        <ListMore
          :params="{
            isLoading: isLoading,
            isNoMore: !pageInfo?.hasNextPage,
            isEmpty: payRecordList.length === 0,
          }"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import NavTopBar from '@/components/applet/NavTopBar.vue'
import ListMore from '@/components/common/ListMore.vue'
// import { getPropertyRechargeListApi } from '@/service/common/common'
import { divide } from '@/utils/num'
import { paymentRecordListApi } from '@/service/bill'
import { PaymentPurposeEnum } from '@/enum/paymentPurposeEnum'

const payRecordList = ref<any[]>([])
const pageInfo = ref<any>(null)
const isLoading = ref(false)
const isRefreshing = ref(false)

const walletId = ref(0)
onLoad((options) => {
  walletId.value = options?.walletId
  getPayRecordList()
})

const params = ref({
  pageIndex: 1,
  pageSize: 10,
  walletId: walletId.value,
  paymentPurpose: PaymentPurposeEnum.Deposit,
})

// 滚动内容以外的高度
const { allRect: outScrollHeight } = useDomRect(['#page-nav-bar-wrapper', '#gap'], 'height')

const getPayRecordList = async (appointPage = 0) => {
  const arg = {
    ...params.value,
  }
  if (appointPage > 0) {
    arg.pageIndex = appointPage
  }
  isLoading.value = true
  const res = await paymentRecordListApi(arg)
  isLoading.value = false
  if (res?.data?.rows) {
    let list = res?.data?.rows ?? []
    list = list.map((item) => {
      item.amount = divide(item.amount, 100)
      return {
        ...item,
        page_index: arg.pageIndex,
      }
    })

    if (appointPage > 0) {
      // 只更新对应页的数据
      let oldItems = payRecordList.value || []
      oldItems = oldItems
        .filter((v) => {
          if (v.page_index === arg.pageIndex) {
            return list.find((t) => t.id === v.id)
          }
          return true
        })
        .map((v) => {
          const matchItem = list.find((t) => t.id === v.id)
          if (matchItem) {
            v = matchItem
          }
          return v
        })
      payRecordList.value = oldItems
    } else {
      pageInfo.value = res
      payRecordList.value = [...payRecordList.value, ...list]
    }
  }
  if (isRefreshing.value) {
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
    })
    isRefreshing.value = false
  }
}

const handleRefresh = () => {
  isRefreshing.value = true
  params.value.pageIndex = 1
  payRecordList.value = []
  getPayRecordList()
}

const handleScrollToBottom = () => {
  if (!isLoading.value && pageInfo.value?.hasNextPage) {
    params.value.pageIndex++
    getPayRecordList()
  }
}
</script>

<style lang="scss" scoped>
.recharge-record-page {
  background-color: #f8f9fb;
}

.record-title {
  flex: 1;
  font-size: 30rpx;
  font-weight: bold;
}

.Infobox {
  background-color: rgb(248, 249, 251);
}

.record-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #999;
}
.status {
  font-size: 26rpx;
}
// 支付状态（0-处理中，1-成功，2-失败）
.status-0 {
  color: var(--warning-color);
}
.status-1 {
  color: var(--success-color);
}
.status-2 {
  color: var(--danger-color);
}

.box-white {
  background-color: #fff;
  border-radius: 16rpx;
}

.item-30 {
  margin-bottom: 30rpx;
}

.record-recevier {
  font-size: 28rpx;
  color: #999;
}
</style>
