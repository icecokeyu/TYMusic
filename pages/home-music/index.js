// pages/home-music/index.js
import { getBanners } from '../../network/music'
import { getSongMenu } from '../../network/music'
import { queryRect } from '../../utils/query-rect'
import throttle from '../../utils/throttle'
const throttleQueryRect = throttle(queryRect, 1000, {trailing: true })
import { rankingStore, rankingMap, playerStore } from '../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    imageHeight: 0,
    recommendSongs: {},
    recommendSongsMenu: [],
    hotSongMenu: [],
    rankings: {3779629: {}, 2884035: {}, 19723756: {}},

    // 音乐播放栏相关数据
    songInfo: {},
    isPlaying: false,
    isPlayingName: 'resume',
    
    isShow: false,
    playAnimState: 'paused',

    // 音乐播放列表
    playListIndex: 0,
    playListSongs: [],
    
    popupShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPageData()

    // rankingStore 通过actions里的getHotSongs方法，发送网络请求
    rankingStore.dispatch('getHotSongs')

    // 数据监听
    // playerStore.dispatch('getMusicPlayerDataAction', 475479888)
    this.handleStoreListener()
  },
  searchClick() {
    wx.navigateTo({
      url: '/pages/search-detail/index'
    })
  },
  getPageData() {
    // 轮播图数据
    getBanners(2).then(res => {
      this.setData({banners: res.banners})
    })
    // 热门歌单数据
    getSongMenu().then(
      res => {
        this.setData({hotSongMenu: res.playlists})
      }
    )
    // 推荐歌单数据(华语)
    getSongMenu("华语").then(res => {
      this.setData({recommendSongsMenu: res.playlists})
    }) 
  },
  // 获取 store状态管理里面的数据 数据监听
  handleStoreListener() {
    // ranking-store
    rankingStore.onState('hotSongs', (res) => {
      if(!res.tracks) return
      let cutSongs = res.tracks.slice(0, 6)
      this.setData({recommendSongs: cutSongs})
    })

    rankingStore.onState('newRanking', this.getRankingHandler(3779629))
    rankingStore.onState('originRanking', this.getRankingHandler(2884035))
    rankingStore.onState('upRanking', this.getRankingHandler(19723756))
    // playerStore
    playerStore.onState('songInfo', songInfo => {
      if(Object.keys(songInfo).length) {
        this.setData({'songInfo': songInfo, 'isShow': true})
      }
    })
    playerStore.onStates(['isPlaying'], ({
      isPlaying
    }) => {
      if(isPlaying) {
        this.setData({'isPlayingName': 'pause', 'playAnimState': 'running'})
      } else {
        this.setData({'isPlayingName': 'resume', 'playAnimState': 'paused'})
      }
      this.setData({'isPlaying': isPlaying})
    })
    // playerStore.onStates(['playListIndex', 'playListSongs'], ({
    //   playListIndex,
    //   playListSongs
    // }) => {
    //   console.log(playListIndex)
    //   console.log(playListSongs)
    //   if(playListIndex !== undefined) this.setData({playListIndex})
    //   if(playListSongs) this.setData({playListIndex})
    // })
    playerStore.onStates(['playListIndex', 'playListSongs'], ({
      playListIndex,
      playListSongs
    }) => {
      if(playListIndex !== undefined) this.setData({playListIndex})
      if(playListSongs) this.setData({playListSongs})
    })
  },
  // 当轮播图图片加载完成触发，动态计算图片的高度 使用节流函数
  handleImageLoad() {
    throttleQueryRect('.swiper-image').then( res => {
      this.setData({imageHeight: res[0].height})
    })
  },
  getRankingHandler(idx) {
    return (res) => {
      if(Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newRankings = { ...this.data.rankings, [idx]: rankingObj}
      this.setData({ 
        rankings: newRankings
      })
    }
  },
  // 推荐歌单 点击更多
  clickMore() {
    this.navigateToDetailSongsPage('hotSongs')
  },
  // 点击更多歌单
  clickSongsListMore() {
    wx.navigateTo({url: '/pages/songs-list/index'})
  },
  clickPeakItem(event) {
    const id = event.currentTarget.dataset.id
    const rankingName = rankingMap[id]
    this.navigateToDetailSongsPage(rankingName)
  },
  navigateToDetailSongsPage: function(rankingName) {
    wx.navigateTo({
      url: `/pages/songs-detail/index?ranking=${rankingName}&type=rank`,
    })
  },
  // 推荐歌曲点击 设置playStore里面的playListIndex playListSongs
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListIndex', index)
    playerStore.setState('playListSongs', this.data.recommendSongs)
  },
  handleIconClick() {
    playerStore.dispatch('changePlayingStatusAction', !this.data.isPlaying)
  },
  showPopup() {
    this.setData({'popupShow': true})
  },
  onClose() {
    this.setData({'popupShow': false})
  },
  handleMusicBarClick() {
    // wx.navigateTo({
    //   url: `/pages/music-player/index?id=${id}`
    // })
    wx.navigateTo({
      url: '/pages/music-player/index'
    })
  }
})