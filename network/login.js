import { Loginrequest } from "./request"

export function getCodeLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success(res) {
        resolve(res.code)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export function sendCodeServer(code) {
  return Loginrequest.post('/login', {
    code
  })
}

export function checkToken() {
  return Loginrequest.post("/auth", {}, true)
}

export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '你好啊,李银河',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}