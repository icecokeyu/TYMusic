// pages/video-detail/index.js 
import { getMvDetail, getMvUrl, getRelatedVideo} from '../../network/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoInfo: {},
    urlData: {},
    relatedVideo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let id = options.id
    this.getDetalVideoData(id)
    
  },
  // 这里也可以不用异步函数，直接promise.then里面写
  async getDetalVideoData(id) {
    // 获取mv数据
    const infoRes = await getMvDetail(id)
    this.setData({videoInfo: infoRes.data})

    // 获取mv地址
    const urlRes = await getMvUrl(id)
    this.setData({urlData: urlRes.data})

    // 相关视频
    const relatedRes = await getRelatedVideo(id)
    this.setData({relatedVideo: relatedRes.data})
  }
})