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
    <NavTopBar bg-color="#fff" title-color="#1a1a1a" btn-theme="black" title="充值记录" />

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
          v-for="item in payRecordList"
          :key="item.id"
          @tap="onClickItem(item)"
        >
          <view class="flex j-s a-c">
            <view class="record-title">充值金额：{{ item.amountStr }}</view>
            <view :class="['status', `status-${item.applyStatus}`]">{{ item.applyStatusStr }}</view>
          </view>
          <view class="Infobox p-30 mt-30">
            <view class="record-text">
              <view>业主：</view>
              <view>{{ item.payUserName }}</view>
            </view>
            <view class="record-text">
              <view>业主手机号：</view>
              <view>{{ item.payUserMappingPhone }}</view>
            </view>
            <view class="record-text">
              <view>业主小区：</view>
              <view>{{ item.houseStr }}</view>
            </view>
            <view class="record-text">
              <view>提交时间：</view>
              <view>{{ item.createdTime }}</view>
            </view>
            <block v-if="item.discount > 0">
              <view class="record-text">
                <view>折扣：</view>
                <view>{{ item.discountStr }}</view>
              </view>
              <view class="record-text">
                <view>折扣后金额：</view>
                <view>{{ item.discountedAmountStr }}</view>
              </view>
            </block>
          </view>
          <view v-if="item.auditRemark" class="flex record-recevier mt-30">
            审核备注：{{ item.auditRemark }}
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
import { getPropertyRechargeListApi } from '@/service/common/common'
import { divide } from '@/utils/num'

const payRecordList = ref<any[]>([])
const pageInfo = ref<any>(null)
const isLoading = ref(false)
const isRefreshing = ref(false)
const navHeight = ref(0)

const params = ref({
  pageIndex: 1,
  pageSize: 10,
  rechargeApplyType: 1,
})

// 获取导航栏高度
const getNavHeight = () => {
  const sysInfo = uni.getSystemInfoSync()
  navHeight.value = sysInfo.statusBarHeight + 44
}

// 获取缴费记录
const getPayRecordList = async (appointPage = 0) => {
  const arg = {
    ...params.value,
  }
  if (appointPage > 0) {
    arg.pageIndex = appointPage
  }
  isLoading.value = true
  const [err, res] = await getPropertyRechargeListApi(arg)
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

const onClickItem = (item: any) => {
  // 直接显示在列表里，不跳去详情页
}

onMounted(() => {
  getNavHeight()
  getPayRecordList()
})
</script>

<style lang="scss" scoped>
.recharge-record-page {
  min-height: 100vh;
  background-color: #fff;
}

.record-title {
  flex: 1;
  font-size: 32rpx;
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
/** 待审核 */
.status-10 {
  color: var(--warning-color);
}
/** 审核通过 */
.status-20 {
  color: var(--success-color);
}
/** 审核不通过 */
.status-30 {
  color: var(--danger-color);
}
/** 已取消 */
.status-40 {
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

.record-recevier {
  font-size: 28rpx;
  color: #999;
}
</style>
