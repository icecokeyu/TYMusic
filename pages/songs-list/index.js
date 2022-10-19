// pages/songs-list/index.js
import { getMoreSongsList } from '../../network/music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chineseMenus: [],
    englishMenus: [],
    antiquityMenus: [],
    popMenus: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPageData()
  },
  getPageData() {
    // 1.华语歌单
    getMoreSongsList().then(res => {
      this.setData({'chineseMenus': res.playlists})
    })
    // 2.欧美歌单
    getMoreSongsList('欧美').then(res => {
      this.setData({'englishMenus': res.playlists})
    })
    // 3.古风歌单
    getMoreSongsList('古风').then(res => {
      this.setData({'antiquityMenus': res.playlists})
    })
    // 4.流行歌单
    getMoreSongsList('流行').then(res => {
      this.setData({'popMenus': res.playlists})
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})