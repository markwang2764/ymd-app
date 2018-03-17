import axios from 'axios'
let qs = require('qs')

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://v3.yunmodel.com' : 'http://v3.yunmodel.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
export function fetch (url, requestClass, data) {
  data = qs.stringify(data)
  return new Promise((resolve, reject) => {
    if (requestClass === 'post') {
      axios.post(url, data)
        .then(response => {
          resolve(response.data)
        })
    } else {
      axios.get(url)
        .then(response => {
          resolve(response.data)
        })
    }
  })
}

export function _fetchAgentHomePage (data) {
  return fetch('V4/getUserHomePage', 'post', data)
}
