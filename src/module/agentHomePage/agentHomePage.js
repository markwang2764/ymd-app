import Vue from 'vue'
import store from './agentHomePagestore'
import agentHomePage from './agentHomePage.vue'
import router from './router/index.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import '../../assets/css/wscss/main.scss'

Vue.use(VueAxios, axios)

import { requestURLparas, setupWebViewJavascriptBridge } from 'assets/js/common.js'

const u = navigator.userAgent
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
if (isAndroid) {
  // register JSBridge callback
  setupWebViewJavascriptBridge((bridge) => {
    bridge.init((message, responseCallback) => {
      const data = {
        'Javascript Responds': 'Wee!'
      }
      responseCallback(data)
    })
  })
}

let token = requestURLparas('token')
if (!token) {
  // get token from app
  setupWebViewJavascriptBridge((bridge) => {
    bridge.callHandler('YMDJSBridge_getToken', {}, (res) => {
      if (typeof res === 'string') {
        res = JSON.parse(res)
      }
      localStorage.setItem('ymdToken', res.token)
      axios.defaults.headers.common['token'] = res.token
    })
  })
}
else {
  // get token from url
  localStorage.setItem('ymdToken', token)
  axios.defaults.headers.common['token'] = localStorage.getItem('ymdToken')
}
// make token cache in loaclStorage
if (localStorage.getItem('ymdToken')) {
  axios.defaults.headers.common['token'] = localStorage.getItem('ymdToken')
}
axios.defaults.baseURL = process.env.NODE_ENV ===
  'production' ? 'http://v3.yunmodel.com' : 'http://v3.yunmodel.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

/* eslint-disable no-new */
new Vue({
  el: '#agentHomePage',
  router,
  store,
  render: h => h(agentHomePage)
}).$mount('#agentHomePage')
