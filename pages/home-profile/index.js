// pages/home-profile/index.js
import { getUserInfo } from '../../network/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  async handleGetUser() {
    const res = await getUserInfo()
    // console.log(res)
    this.setData({'userInfo': res.userInfo})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  }
})