import axios from 'axios'

// 功能：获取url参数
// 参数：
//    ＊ paras － 传进来的key值
// 返回值：
//    ＊ returnValue -对应key值的value值
function requestURLparas(paras) {
  const url = location.href
  const paraString = url.substr(url.indexOf('?') + 1).split('&')
  const paraObj = {}
  let j = null
  for (let i = 0; i < paraString.length; i++) {
    j = paraString[i]
    const key = j.substring(0, j.indexOf('=')).toLowerCase()
    paraObj[key] = j.substring(j.indexOf('=') + 1, j.length)
  }
  const returnValue = paraObj[paras.toLowerCase()]
  if (typeof (returnValue) === 'undefined') {
    return ''
  }
  return returnValue
}

// 功能：判断是否是安卓机型
// 参数：
//    无
// 返回值：
//    ＊ true  - 环境为安卓机
//    ＊ false - 环境为非安卓机
function isAndroid() {
  const u = navigator.userAgent
  return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
}

// 功能：注册JSBridge环境
function setupWebViewJavascriptBridge(callback) {
  if (isAndroid()) {
    if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge) }
    window.document.addEventListener('WebViewJavascriptBridgeReady', () => {
      callback(window.WebViewJavascriptBridge)
    }, false)
    return
  }
  if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge) }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
  window.WVJBCallbacks = [callback]
  const WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(() => { document.documentElement.removeChild(WVJBIframe) }, 0)
}

function formatTime(value) {
  return new Date(value * 1000).toLocaleString().replace(/\//g, '-')
  .slice(0, 9)
}

function getToken() {
  return new Promise((reslove, reject) => {
    const token = requestURLparas('token')
    if (!token) {
      // get token from app
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_getToken', {}, (res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          axios.defaults.headers.common['token'] = res.token
          localStorage.setItem('ymdToken', res.token)
          reslove('get token from app')
        })
      })
    }
    else {
      // get token from url
      axios.defaults.headers.common['token'] = token
      localStorage.setItem('ymdToken', token)
      reslove('get token from url')
    }
  })
}

function setTokenFromLocalStorage() {
  if (!axios.defaults.headers.common['token']) {
    const token = localStorage.getItem('ymdToken')
    if (token) {
      axios.defaults.headers.common['token'] = token
    }
    else {
      // 登出
    }
  }
  return true
}

export {
  requestURLparas,
  isAndroid,
  setupWebViewJavascriptBridge,
  formatTime,
  getToken
}
