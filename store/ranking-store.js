import { HYEventStore } from 'hy-event-store'
import { songRanking } from '../network/music'
const rankingMap = {3778678: 'hotSongs', 3779629: 'newRanking', 2884035: 'originRanking', 19723756: 'upRanking'}

const rankingStore = new HYEventStore({
  state: {
    hotSongs: {},
    newRanking: {},
    originRanking: {},
    upRanking: {}
  },
  actions: {
    getHotSongs(ctx) {
      songRanking(3778678).then(res => {
        ctx.hotSongs = res.playlist
      })
      songRanking(3779629).then(res => {
        ctx.newRanking = res.playlist
      })
      songRanking(2884035).then(res => {
        ctx.originRanking = res.playlist
      })
      songRanking(19723756).then(res => {
        ctx.upRanking = res.playlist
      })
    }
  }
})

export {
  rankingStore,
  rankingMap
}