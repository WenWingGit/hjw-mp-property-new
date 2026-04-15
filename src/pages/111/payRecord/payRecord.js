// pages/index/payFees/payRecord/payRecord.js
import { getPropertyRechargeListApi } from '../../../../api/rechargeApply'
import { Router } from '../../../../utils/common'
import { divide } from '../../../../utils/num'

Router({
  data: {
    // 缴费记录
    pay_record_list: [],
    is_first_load: true,

    params: {
      pageIndex: 1,
      pageSize: 10,
      rechargeApplyType: 1
    },

    // 分页信息&刷新状态,下拉刷新时
    page_info: null,
    current_click_page_index: 0,
    is_first_load: true,
    is_loading: false,
    is_refreshing: false,
  },

  async onLoad() {
  },

  async onShow() {
    if (this.data.current_click_page_index > 0) {
      this.getPayRecordList(this.data.current_click_page_index)
      this.setData({
        current_click_page_index: 0,
      })
    } else {
      this.getPayRecordList()
    }
  },

  // 获取缴费记录
  async getPayRecordList (appoint_page = 0) {
    const arg = {
      ...this.data.params,
    }
    if (appoint_page > 0) {
      arg.pageIndex = appoint_page
    }
    this.setData({
      is_loading: true,
    })
    const [err, res] = await getPropertyRechargeListApi(arg)
    this.setData({
      is_loading: false,
    })
    if (!err && Array.isArray(res?.rows)) {
      let list = res?.rows ?? []
      list = list.map((item) => {
        item.amount = divide(item.amount, 100)
        return {
          ...item,
          page_index: arg.pageIndex,
        }
      })


      if (appoint_page > 0) {
        // 只更新对应页的数据
        let oldItems = this.data.pay_record_list || []
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
        this.setData({
          pay_record_list: oldItems,
        })
      } else {
        this.setData({
          page_info: res,
          pay_record_list: [...this.data.pay_record_list, ...list],
        })
      }
    }
    if (this.data.is_refreshing) {
      this.$tips('刷新成功')
      this.setData({
        is_refreshing: false,
      })
    }

  },

  handleRefresh () {
    this.setData({
      is_refreshing: true,
      ['params.pageIndex']: 1,
      pay_record_list: [],
    })
    this.getPayRecordList()
  },

  handleScrollToBottom () {
    if (!this.data.is_loading && this.data.page_info?.hasNextPage) {
      this.setData({
        ['params.pageIndex']: ++this.data.params.pageIndex
      })
      this.getPayRecordList()
    }
  },

  onClickItem (e) {
    // this.setData({
    //   current_click_page_index: e.detail.page_index,
    // })
    // 直接显示在列表里，不跳去详情页
    // this.$nav('/pages/index/payFees/payRecord/payRecordDetail/payRecordDetail', {
    //   id: e.detail.id,
    // })
  },

  onReady() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},

  onShareAppMessage() {}
})
