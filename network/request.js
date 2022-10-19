const BASE_URL = 'http://127.0.0.1:3000'
// const BASE_URL = 'http://123.207.32.32:9001'
const timeout = 10000
const loginBaseUrl = 'http://123.207.32.32:3000'
import { TOKEN_KEY } from '../contants/token-const'
const token = wx.getStorageSync(TOKEN_KEY)

class Tyrequest{
  constructor(baseUrl, authHeader) {
    this.baseUrl = baseUrl
    this.authHeader = authHeader
  }
  request(url, method, params, isAuth = false, header = {}) {
    const finalHeader = isAuth ? { ...this.authHeader, ...header }: header
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + url, 
        data: params,
        method: method,
        timeout: timeout,
        header: finalHeader,
        success: res => {
          resolve(res.data)
        },
        fail: err => {
          reject(err)
          console.log(err)
        }
      })
    })
  }
  get(url, params, isAuth = false, header) {
    return this.request(url, 'GET', params, isAuth, header)
  }
  post(url, params, isAuth = false, header) {
    return this.request(url, 'POST', params, isAuth, header)
  }
}

const Loginrequest = new Tyrequest(loginBaseUrl, { token })
export default new Tyrequest(BASE_URL)
export {
  Loginrequest
}
