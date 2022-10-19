import Tyrequest from './request'

export function getSongDetail(ids) {
  return Tyrequest.get('/song/detail', {
    ids
  })
}

export function getSongLyric(id) {
  return Tyrequest.get('/lyric', {
    id
  })
}

export function getSongUrl(id) {
  return Tyrequest.get('/song/url', {
    id
  })
}