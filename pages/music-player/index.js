// pages/music-player/index.js
import { playerStore } from '../../store/player-store'
import { audioContext } from '../../store/player-store'
const playModeNames = ['order', 'repeat', 'random']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    songInfo: {},
    songUrl: '',
    duration: 0,
    lyricInfo: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',

    playModeIndex: 0,
    playModeName: 'order',

    isPlaying: false,
    isPlayingName: 'resume',

    playListIndex: 0,
    playListSongs: [],

    scrollTop: 0,
    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    sliderValue: 0,
    isSliderChanging: false,

    isShow: false
  },
  // 网络请求
  // setPageData(ids) {
  //   getSongDetail(ids).then(res => {
  //     this.setData({'songInfo': res.songs[0]})
  //     this.setData({'duration': res.songs[0].dt})
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const id = options.id
    this.setData({id})

    // 获取store中值的变化
    this.setupPlayerStoreListener()

    // 获取songUrl
    // const res = await getSongUrl(id)
    // this.setData({'songUrl': res.data[0].url})

    // 获取lyric歌词
    // const resLyric = await getSongLyric(id)
    // const lyricInfo =  parseLyric(resLyric.lrc.lyric)
    // this.setData({lyricInfo})

    // 动态计算contentHeight的高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const resolution = globalData.resolution
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({contentHeight, isMusicLyric: resolution >= 2})

    // 4.创建播放器
    // audioContext.stop()
    // audioContext.src = this.data.songUrl
    // audioContext.autoplay = true
    // this.getAudioContextListener()
  },
  // audio监听
  // getAudioContextListener() {
  //   audioContext.onCanplay(() => {
  //     audioContext.play()
  //   })
  //   audioContext.onTimeUpdate(() => {
  //     const currentTime = audioContext.currentTime * 1000
  //     if(!this.data.isSliderChanging) {
  //       const sliderValue = currentTime / this.data.duration * 100
  //       this.setData({currentTime, sliderValue})
  //     }

  //     // 匹配当前时间的歌词
  //     let i = 0
  //     for(; i < this.data.lyricInfo.length; i++) {
  //       const lyricLine = this.data.lyricInfo[i]
  //       const currentLyricTime = lyricLine.lyricTime
  //       if(currentTime < currentLyricTime) {
  //         break
  //       }
  //     }
  //     const currentIndex = i - 1
  //     if(currentIndex !== this.data.currentLyricIndex)  {
  //       const currentLyric = this.data.lyricInfo[currentIndex]
  //       const scrollTop = currentIndex * 35
  //       this.setData({currentLyricText: currentLyric.txt, currentLyricIndex: currentIndex, scrollTop})
  //     }
  //   })
  // },
  // ==================事件处理====================
  handleSwiperChange(event) {
    const current = event.detail.current
    this.setData({currentPage: current})
  },
  // 完成一次拖动后触发的事件
  handleSliderChange(event) {
    const sliderValue = event.detail.value
    const currentTime = this.data.duration * sliderValue / 100

    // audioContext.pause()
    audioContext.seek(currentTime / 1000)
    this.setData({sliderValue, isSliderChanging: false})
  },
  // 拖动过程中触发的事件，event.detail = {value}	
  handleSliderChanging(event) {
    const sliderValue = event.detail.value
    const currentTime = this.data.duration * sliderValue / 100
    this.setData({isSliderChanging: true, currentTime})
  },
  // 点击返回按钮
  handleBackBtnClick() {
    wx.navigateBack()
  },
  handleModeBtnchange() {
    let playModeIndex = this.data.playModeIndex + 1
    if(playModeIndex===3) playModeIndex = 0

    playerStore.setState('playModeIndex', playModeIndex)
  },
  handlePlayingBtnchange() {
    // 需要改变 isPlaying的值 并播放或者暂停歌曲 将逻辑写在store里面合适
    playerStore.dispatch('changePlayingStatusAction', !this.data.isPlaying)
  },
  // 上一首
  handlePrevBtnClick() {
    console.log('PrevBtnClick')
    playerStore.dispatch('changeNewMusicAction', false)
  },
  // 下一首
  handleNextBtnClick() {
    console.log('NextBtnClick')
    playerStore.dispatch('changeNewMusicAction')
  },
  // 控制歌单列表弹出 隐藏
  showPopup() {
    this.setData({'isShow': true})
    console.log(this.data.isShow)
  },
  onClose() {
    this.setData({'isShow': false})
    console.log(this.data.isShow)
  },
  // ======================监听store中值的变化==============
  setupPlayerStoreListener() {
    playerStore.onStates(['songInfo', 'duration', 'songUrl', 'lyricInfo'], ({
      songInfo,
      duration,
      songUrl,
      lyricInfo
    }) => {
      if(songInfo) this.setData({songInfo})
      if(duration) this.setData({duration})
      if(songUrl) this.setData({songUrl})
      if(lyricInfo) this.setData({lyricInfo})
    }),
    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      if(currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.duration * 100
        this.setData({currentTime, sliderValue})
      }
      if(currentLyricIndex) {
        const scrollTop = currentLyricIndex * 35
        this.setData({currentLyricIndex, scrollTop})
      }
      if(currentLyricText) this.setData({currentLyricText})
    }),
    playerStore.onStates(['playModeIndex', 'isPlaying'], ({
      playModeIndex,
      isPlaying
    }) => {
      if(playModeIndex !== undefined) {
        const playModeName = playModeNames[playModeIndex]
        this.setData({playModeIndex, playModeName})
      }
      if(isPlaying !== undefined) {
        console.log(isPlaying)
        const isPlayingName = isPlaying ? 'pause': 'resume'
        console.log(isPlayingName)
        this.setData({isPlaying, isPlayingName})
      }
    }),
    playerStore.onStates(['playListIndex', 'playListSongs'], ({
      playListIndex,
      playListSongs
    }) => {
      if(playListIndex !== undefined) this.setData({playListIndex})
      if(playListSongs) this.setData({playListSongs})
    })
  },
  onUnload() {

  }
})