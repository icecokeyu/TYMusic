// component/song-list-v1/index.js
import { playerStore } from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick(event) {
      const id = event.currentTarget.dataset.id
      // 1.跳转到音乐播放页面
      wx.navigateTo({
        url: `/pages/music-player/index?id=${id}`
      })
      // 2.dispatch状态管理里面的getMusicPlayerDataAction 
      playerStore.dispatch('getMusicPlayerDataAction', id)
    }
  }
})
