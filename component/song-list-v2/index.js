// component/song-list-v2/index.js
import { playerStore } from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songInfo: {
      type: Array,
      value: []
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
      //  1.跳转到播放页
      wx.navigateTo({
        url: `/pages/music-player/index?id=${id}`
      })
      // 2.dispatch状态管理里面的getMusicPlayerDataAction 
      playerStore.dispatch('getMusicPlayerDataAction', id )

      // 3.将index 和 歌曲列表存入playStore中
      const index = event.currentTarget.dataset.index
      playerStore.setState('playListIndex', index)
      playerStore.setState('playListSongs', this.data.songInfo)
    }
  }
})
