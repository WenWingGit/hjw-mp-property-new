<route lang="json5">
{
  style: {
    navigationBarTitleText: '支付记录',
    hidesTabBar: true,
    navigationStyle: 'custom',
    navigationBarTextStyle: 'white',
  },
}
</route>
<template>
  <view class="payment-record-page">
    <NavTopBar bg-color="#fff" title-color="#1a1a1a" btn-theme="black" title="支付记录" />

    <scroll-view
      class="mt-15"
      style="height: calc(100vh - 15rpx - {{ navHeight }})"
      scroll-y
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="handleRefresh"
      @scrolltolower="handleScrollToBottom"
    >
      <view class="page-container pb-40">

        <view
          class="box-white p-30 item-30"
          v-for="item in paymentRecordList"
          :key="item.id"
          @tap="onClickItem(item)"
        >
          <view class="flex j-s a-c">
            <view class="record-title">支付金额：{{ item.amountStr }}</view>
            <view :class="['status', `status-${item.status}`]">{{ item.statusStr }}</view>
          </view>
          <view class="Infobox p-30 mt-30">
            <view class="record-text">
              <view>支付方式：</view>
              <view>{{ item.payMethodStr }}</view>
            </view>
            <view class="record-text">
              <view>支付时间：</view>
              <view>{{ item.payTime }}</view>
            </view>
            <view class="record-text">
              <view>交易单号：</view>
              <view>{{ item.tradeNo }}</view>
            </view>
            <view class="record-text">
              <view>业务类型：</view>
              <view>{{ item.businessTypeStr }}</view>
            </view>
          </view>
        </view>

        <ListMore :params="{
          isLoading: isLoading,
          isNoMore: !pageInfo?.hasNextPage,
          isEmpty: paymentRecordList.length === 0
        }" />
      </view>

    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import NavTopBar from '@/components/applet/NavTopBar.vue'
import ListMore from '@/components/common/ListMore.vue'
import { getPropertyPaymentListApi } from '@/service/common/common'
import { divide } from '@/utils/num'

const paymentRecordList = ref<any[]>([])
const pageInfo = ref<any>(null)
const isLoading = ref(false)
const isRefreshing = ref(false)
const navHeight = ref(0)

const params = ref({
  pageIndex: 1,
  pageSize: 10
})

// 获取导航栏高度
const getNavHeight = () => {
  const sysInfo = uni.getSystemInfoSync()
  navHeight.value = sysInfo.statusBarHeight + 44
}

// 获取支付记录
const getPaymentRecordList = async (appointPage = 0) => {
  const arg = {
    ...params.value,
  }
  if (appointPage > 0) {
    arg.pageIndex = appointPage
  }
  isLoading.value = true
  const [err, res] = await getPropertyPaymentListApi(arg)
  isLoading.value = false
  if (!err && Array.isArray(res?.rows)) {
    let list = res?.rows ?? []
    list = list.map((item) => {
      item.amount = divide(item.amount, 100)
      return {
        ...item,
        page_index: arg.pageIndex,
      }
    })

    if (appointPage > 0) {
      // 只更新对应页的数据
      let oldItems = paymentRecordList.value || []
      oldItems = oldItems.filter(v => {
        if (v.page_index === arg.pageIndex) {
          return list.find((t) => t.id === v.id)
        }
        return true
      }).map((v) => {
        const matchItem = list.find((t) => t.id === v.id)
        if (matchItem) {
          v = matchItem
        }
        return v
      })
      paymentRecordList.value = oldItems
    } else {
      pageInfo.value = res
      paymentRecordList.value = [...paymentRecordList.value, ...list]
    }
  }
  if (isRefreshing.value) {
    uni.showToast({
      title: '刷新成功',
      icon: 'success'
    })
    isRefreshing.value = false
  }
}

const handleRefresh = () => {
  isRefreshing.value = true
  params.value.pageIndex = 1
  paymentRecordList.value = []
  getPaymentRecordList()
}

const handleScrollToBottom = () => {
  if (!isLoading.value && pageInfo.value?.hasNextPage) {
    params.value.pageIndex++
    getPaymentRecordList()
  }
}

const onClickItem = (item: any) => {
  // 直接显示在列表里，不跳去详情页
}

onMounted(() => {
  getNavHeight()
  getPaymentRecordList()
})
</script>

<style lang="scss" scoped>
.payment-record-page {
  min-height: 100vh;
  background-color: #fff;
}

.record-title {
  font-size: 32rpx;
  font-weight: bold;
  flex: 1;
}

.Infobox {
  background-color: rgb(248, 249, 251);
}

.record-text {
  margin-bottom: 20rpx;
  font-size: 28rpx;
  display: flex;
  color: #999;
  justify-content: space-between;
}

/** 待支付 */
.status-10 {
  color: var(--warning-color);
}

/** 支付成功 */
.status-20 {
  color: var(--success-color);
}

/** 支付失败 */
.status-30 {
  color: var(--danger-color);
}

.mt-15 {
  margin-top: 15rpx;
}

.box-white {
  background-color: #fff;
  border-radius: 16rpx;
}

.p-30 {
  padding: 30rpx;
}

.item-30 {
  margin-bottom: 30rpx;
}

.mt-30 {
  margin-top: 30rpx;
}

.pb-40 {
  padding-bottom: 40rpx;
}

.flex {
  display: flex;
}

.j-s {
  justify-content: space-between;
}

.a-c {
  align-items: center;
}
</style>