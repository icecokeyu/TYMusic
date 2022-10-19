// pages/home-video/index.js
import { getTopMv } from '../../network/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMv: [],
    hasMore: true
  },
  // 封装网络请求的方法
  async getTopMvData(offset) {
    if(!this.data.hasMore) return

    //展示动画
    wx.showNavigationBarLoading();

    // 请求数据
    const res = await getTopMv(offset)
    let newData = this.data.topMv
    if(offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }

    // 设置数据
    this.setData({topMv: newData})
    this.setData({hasMore: res.hasMore})

    wx.hideNavigationBarLoading()
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // const res = await getTopMv(0)
    // this.setData({topMv: res.data})
    this.getTopMvData(0)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    // 重新加载最新的数据
    // const res = await getTopMv(0)
    // this.setData({topMv: res.data})
    this.getTopMvData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    // 上拉加载更多的数据
    // if(!this.data.hasMore) return
    // const res = await getTopMv(this.data.topMv.length)
    // this.setData({topMv: this.data.topMv.concat(res.data)})
    // this.setData({hasMore: res.hasMore})
    this.getTopMvData(this.data.topMv.length)
  },
  // 点击跳转到mv详情页
  videoItemClick(event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/video-detail/index?id=${id}`
    })
  }
})