// pages/songs-detail/index.js
import { rankingStore } from '../../store/index'
import { getMenuDetail } from '../../network/music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    songInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type
    this.setData({ type })
    if(type === 'rank') {
      const rankingName = options.ranking
      rankingStore.onState(rankingName, res => {
        this.setData({ songInfo : res})
      })
    } else if(type === 'menu') {
      const id = options.id
      getMenuDetail(id).then(res => {
        this.setData({ songInfo : res})
      })
    }
  },

  

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  }
})