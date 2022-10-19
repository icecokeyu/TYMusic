import Tyrequest from './request'


// 获取热门搜索列表
export function getHotList() {
  return Tyrequest.get('/search/hot')
}

// 搜索建议
export function getSearchSuggest(keywords, type='mobile') {
  return Tyrequest.get('/search/suggest', {
    keywords,
    type
  })
}

// 搜索结果

export function getSearchResult(keywords, limit=30, offset=0) {
  return Tyrequest.get('/search', {
    keywords,
    limit,
    offset
  })
}