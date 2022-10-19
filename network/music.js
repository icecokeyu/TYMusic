import Tyrequest from './request'

// 获取banners轮播图数据
export function getBanners(type) {
  return Tyrequest.get('/banner', {
    type
  })
}

// 推荐歌曲（热歌榜）
export function songRanking(id) {
  return Tyrequest.get('/playlist/detail', {
    id
  })
}

// 获取歌单
export function getSongMenu(cat="全部", limit=6, offset=0) {
  return Tyrequest.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}

// 获取歌单的歌曲详情
export function getMenuDetail(id, limit=100, offset=0) {
  return Tyrequest.get('/playlist/track/all', {
    id,
    limit,
    offset
  })
}

// 获取更多歌单
export function getMoreSongsList(cat = '华语', limit = 6) {
  return Tyrequest.get('/top/playlist/highquality', {
    cat,
    limit
  })
}

