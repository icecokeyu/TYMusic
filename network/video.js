import Tyrequest from './request'

// 获取mv排行
export function getTopMv(offset, limit = 10) {
  return Tyrequest.get('/top/mv', {
    offset,
    limit
  })
}

// 获取mv数据
export function getMvDetail(mvid) {
  return Tyrequest.get('/mv/detail', {
    mvid
  })
}

// 获取mv地址

export function getMvUrl(id) {
  return Tyrequest.get('/mv/url', {
    id
  })
}

// 相关视频

export function getRelatedVideo(id) {
  return Tyrequest.get('/related/allvideo', {
    id
  })
}