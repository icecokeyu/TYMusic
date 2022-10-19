// app.js
import { getCodeLogin, sendCodeServer, checkToken, checkSession } from './network/login'
import { TOKEN_KEY } from './contants/token-const'
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    resolution: 0
  },
  // 当小程序加载时
  onLaunch: async function() {
    // 1.保存全局的设备数据
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    const resolution = info.screenHeight / info.screenWidth
    this.globalData.resolution = resolution


    // 2.让用户默认进行登录
    this.handleLogin()
  },
  async handleLogin() {
    const token = wx.getStorageSync(TOKEN_KEY)
    // token有没有过期
    const checkResult = await checkToken()
    console.log(checkResult)
    // 判断session是否过期
    const isSessionExpire = await checkSession()
    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },
  async loginAction() {
    // 登录相关
    // 1.获取code
    const code = await getCodeLogin()

    // 2.向服务器发送code 并获取token
    const res = await sendCodeServer(code)
    const token = res.token

    // 保存token
    wx.setStorageSync(TOKEN_KEY, token)
  }
})
