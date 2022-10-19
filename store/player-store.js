import { getSongDetail, getSongLyric, getSongUrl } from '../network/player'
import { HYEventStore } from 'hy-event-store'
import { parseLyric } from '../utils/parse-lyric'

// wx.createInnerAudioContext()只能在前台播放 如果小程序退出前台 在后台运行将不能播放
// 使用wx.getBackgroundAudioManager()背景音频 前台和后台都使用这个
// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

// 若需要在小程序切后台后继续播放音频，需要在 app.json 中配置 requiredBackgroundModes 属性

// 音频标题，用于原生音频播放器音频标题（必填）。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。

const playerStore = new HYEventStore({
  state: {
    // 监听背景音乐停止
    isStoping: false,
    isFirstPlay: true,
    id: 0,
    // 当前播放的歌曲
    songInfo: {},
    songUrl: '',
    duration: 0,
    lyricInfo: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',

    playModeIndex: 0,  // 0顺序播放 1单曲播放 2 循环播放
    isPlaying: false, // 播放状态 flase暂停 true播放

    playListIndex: 0,
    playListSongs: []
  },
  actions: {
    async getMusicPlayerDataAction(ctx, id) {
      // 如果返回home-music 再播放同一首歌 歌曲播放时保持原状态，暂停时状态改为播放
      if(ctx.id == id) {
        this.dispatch('changePlayingStatusAction', true)
        return
      }

      ctx.id = id

      // 修改音乐播放状态
      ctx.isPlaying = true
      // 清除数据残留，将上一首歌的数据置空
      ctx.songInfo = {}
      ctx.songUrl =  ''
      ctx.duration = 0
      ctx.lyricInfo = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ''

      
      // 1.获取songInfo duration
      const infoRes = await getSongDetail(id)
      ctx.songInfo = infoRes.songs[0]
      ctx.duration = infoRes.songs[0].dt

      // 2.获取songUrl
      const res = await getSongUrl(id)
      ctx.songUrl = res.data[0].url

      // 3.获取歌词
      const resLyric = await getSongLyric(id)
      const lyricInfo = parseLyric(resLyric.lrc.lyric)
      ctx.lyricInfo = lyricInfo

      // 4.创建播放器
      audioContext.stop()
      audioContext.src = ctx.songUrl
      // 使用createInnerAudioContext时，title为必填
      audioContext.title = ctx.id
      audioContext.autoplay = true

      // 5.audio监听 都是同一个audioContext对象只需要监听一次
      // this.dispatch('setUpAudioContextListenerAction')
      if(ctx.isFirstPlay) {
        this.dispatch('setUpAudioContextListenerAction')
        ctx.isFirstPlay = false
      }
    },
    setUpAudioContextListenerAction(ctx) {
      audioContext.onCanplay(() => {
        audioContext.play()
      })

      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000
        ctx.currentTime = currentTime
        
  
        // 匹配当前时间的歌词
        let i = 0
        for(; i < ctx.lyricInfo.length; i++) {
          const lyricLine = ctx.lyricInfo[i]
          const currentLyricTime = lyricLine.lyricTime
          if(currentTime < currentLyricTime) {
            break
          }
        }
        const currentIndex = i - 1
        if(currentIndex !== ctx.currentLyricIndex)  {
          const currentLyric = ctx.lyricInfo[currentIndex]
          ctx.currentLyricIndex = currentIndex
          // console.log(currentLyric.txt)
          ctx.currentLyricText = currentLyric.txt
        }
      })

      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })

      // 4.监听后台歌曲播放 后台是可以点击的
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })

      // 5.监听后台歌曲暂停
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })

      // 6.监听后台关掉音乐 ，音乐停止 
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },
    // 改变播放状态
    changePlayingStatusAction(ctx, isPlaying) {
      ctx.isPlaying = isPlaying
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = currentSong.name
      }
      if (ctx.isStoping) {
        audioContext.seek(ctx.currentTime)
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    // 下一首 下一首逻辑只有顺序播放的时候不一样，抽取到一起 因为状态要共享到首页，所以使用状态管理
    changeNewMusicAction(ctx, isNext = true) {
      // 根据播放顺序按钮 不同 index的操作不同
      let index = ctx.playListIndex
      switch(ctx.playModeIndex) {
        case 0:
          index = isNext ? index + 1 : index - 1
          if(index === -1) index = ctx.playListSongs.length - 1
          if(index === ctx.playListSongs.length) index = 0
           break;
        case 1:
          break;
        case 2:
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break;
      }
      // 更新数据
      let songInfo = ctx.playListSongs[index]
      if(!songInfo) {
        songInfo = ctx.songInfo
      } else {
        ctx.playListIndex = index
      }

      // 播放音乐
      this.dispatch('getMusicPlayerDataAction', songInfo.id)
    }
  }
})

export {
  audioContext,
  playerStore
}