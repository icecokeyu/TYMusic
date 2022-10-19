// pages/search-detail/index.js
import { getHotList, getSearchSuggest, getSearchResult } from '../../network/search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/stringToNodes'
const debounceGetSearchSuggest = debounce(getSearchSuggest)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    hotList: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    searchResult: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPageData()
  },
  getPageData() {
    getHotList().then(res => {
      this.setData({hotList: res.result.hots})
    })
  },
 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  // 输入框中的关键词改变
  handleValueChange(event) {
    // 1.获取输入的关键字
    const searchValue = event.detail

    // 2.保存关键字
    this.setData({ searchValue })

    // 3.判断关键字为空字符的处理逻辑
    if (!searchValue.length) {
      this.setData({ suggestSongs: [] })
      this.setData({ searchResult: []})
      debounceGetSearchSuggest.cancel()
      return
    }

    // 4.根据关键字进行搜索 增加防抖处理
    debounceGetSearchSuggest(searchValue).then(res => {
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      if(!suggestSongs) return

      // 拿到suggestSongs里面的keyword 
      const suggestKeyword = this.data.suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for(let keyword of suggestKeyword) {
        // 用富文本，把相同的标红匹配
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },
  handleSearchResult() {
    // 保存一下searchValue
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({ searchResult: res.result.songs })
    })
  },
  handleKeywordItemClick(event) {
    const keyword = event.currentTarget.dataset.keyword
    this.setData({searchValue: keyword})
    this.handleSearchResult()
  }
})