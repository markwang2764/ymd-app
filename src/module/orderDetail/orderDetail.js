import Vue from 'vue'
import orderDetail from './orderDetail.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'assets/css/wscss/main.scss'

Vue.use(VueAxios, axios)

import { setupWebViewJavascriptBridge } from 'assets/js/common.js'

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

axios.defaults.baseURL = process.env.NODE_ENV ===
  'production' ? 'http://v3.yunmodel.com' : 'http://v3.yunmodel.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(orderDetail)
})
