<template>
  <div id="app">
    <header-bar title="订单详情" :back-to-app="!fromOrder" :back-to-serve-list="fromOrder" :user-type="userType" :type="type"></header-bar>
    <div class="emptyLog" v-show="!(res.serve_end_at > 0)">
      正在加载中，请稍等～
    </div>
    <section v-show="res.serve_end_at > 0">
      <div style="height: 56px; line-height: 56px; text-align: center; color: #eb0044; font-size: 1.4rem;">
        <span>订单状态:&nbsp;</span>
        <span>{{ statusMap[res.status-1] }}</span>
      </div>
      <ul class="list">
        <li>
          <span>服务名称</span>
          <span>{{ res.serve_name }}</span>
        </li>
        <li>
          <span>服务数量</span>
          <span>{{ res.number }}</span>
        </li>
        <div>
          <h3>服务要求</h3>
          <div class="require-list" v-for="list in res.serve_require">
            <div class="text" v-html='return2Br(list.Desc)'></div>
            <div class="photo-list" @click="lookBigPicture(list.PhotoArr)">
              <div class="photo" v-for="item in list.PhotoArr" :style="'background-image: url(' + item + ')'"></div>
            </div>
          </div>
        </div>
        <li>
          <span>服务截止时间</span>
          <span>{{ res.serve_end_at | formatTimeFilter }}</span>
        </li>
        <li>
          <span>麻豆需付押金</span>
          <span>&yen; {{ res.deposit | toFixedZero }}</span>
        </li>
        <div style="padding-bottom: 20px;">
          <h3>报酬总计</h3>
          <p>{{ res.serve_name }} &times;{{ res.number }}</p>
          <p class="ceb0">&yen; {{ res.order_price | toFixedZero }}</p>
        </div>
      </ul>
    </section>
    <footer v-show="res.serve_end_at > 0 && !fromOrder && !fromMChat">
      <div v-if="userType == '1'">
        <div v-if="res.status == '2'">
          <a v-if="res.deposit != '0'" @click="YMDJSBridge_Serves('ModelPay', res)" class="get-order fr">接单</a>
          <a v-else @click="orderApi('接单', res, 'receiveServeOrder')" class="get-order fr">接单</a>
          <a @click="orderApi('拒接', res, 'serveOrderCancel')" class="refuse fr">拒绝</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
        <div v-if="res.status == '3'">
          <a @click="YMDJSBridge_Serves('CustomerServe', res)" class="custom fr">客服</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
        <div v-if="res.status == '4'">
          <a @click="YMDJSBridge_Serves('CustomerServe', res)" class="custom fr">客服</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
        <div v-if="res.status == '5'">
          <a @click="YMDJSBridge_Serves('ModelAppraise', res)" class="evaluate fr"
            v-if="res.target_evaluate_at == '0'">评价
          </a>
          <a @click="YMDJSBridge_Serves('CustomerServe', res)" class="custom fr">客服</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
        <div v-if="res.status == '6'">
          <a @click="YMDJSBridge_Serves('CustomerServe', res)" class="custom fr">客服</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
      </div>
      <div v-if="userType == '2'">
        <div v-if="res.status === '1'">
          <div class="fl">
            <span>合计: </span>
            <span class="ceb0">&yen; {{ res.order_price | toFixedZero }}</span>
          </div>
          <div @click="orderPay(res)" class="fr pay">去支付</div>
        </div>
        <div v-if="res.status == '2'">
          <a @click="orderApi('取消', res, 'serveOrderCancel')" class="refuse fr">取消</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
        <div v-if="res.status == '3'">
          <a @click="YMDJSBridge_Serves('CustomerServe', res)" class="custom fr">客服</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
        <div v-if="res.status == '4'">
          <a @click="orderApi('完成', res, 'serveOrderComplete')" class="custom fr">确认完成</a>
          <a @click="orderApi('延时', res, 'V4/delayOrderTime')" class="delay fr">延时</a>
          <a @click="YMDJSBridge_Serves('CustomerServe', res)" class="custom fr">客服</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
        <div v-if="res.status == '5'">
          <a @click="YMDJSBridge_Serves('MerchantAppraise', res)" class="evaluate fr"
            v-if="res.evaluate_at == '0'">评价
          </a>
          <a @click="YMDJSBridge_Serves('CustomerServe', res)" class="custom fr">客服</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
        <div v-if="res.status == '6'">
          <a @click="YMDJSBridge_Serves('CustomerServe', res)" class="custom fr">客服</a>
          <a @click="YMDJSBridge_Serves('MChat', res)" class="talk fr">M聊</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import headerBar from './components/header-bar.vue'
import {
  requestURLparas,
  setupWebViewJavascriptBridge,
  getToken
} from 'assets/js/common'
let qs = require('qs')

export default {
  data () {
    return {
      res: {},
      userType: '1',
      type: '',
      orderUuid: null,
      fromOrder: false,
      fromMChat: false,
      statusMap: [
        '待支付',
        '待接单',
        '服务未开始',
        '服务进行中',
        '已完成',
        '手动取消',
        '系统取消'
      ]
    }
  },
  mounted () {
    getToken().then(() => {
      this.init()
    })
  },
  methods: {
    init () {
      this.fromOrder = requestURLparas('o') === '1'
      this.fromMChat = requestURLparas('m') === '1'
      this.type = requestURLparas('type')
      this.orderUuid = requestURLparas('order_uuid')
      this.userType = requestURLparas('user_type')
      this.getOrderDetail()
      this.getSystemNoticeNumber()
    },
    return2Br (str) {
      return str.replace(/\r?\n/g, '<br>')
    },
    lookBigPicture (photoArr) {
      const data = {
        photos: photoArr
      }
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_ShowGallery', data, () => {})
      })
    },
    getSystemNoticeNumber () {
      Vue.axios.post('V4/getSystemNoticeNumber', {})
      .then((res) => {
        res = res.data
        const code = res.code
        if (code === '1') {
          let arr = []
          if (this.userType === '1' && this.type !== '3') {
            arr = res.data.model_notice_uuid_list
          }
          else if (this.userType === '2') {
            arr = res.data.business_notice_uuid_list
          }
          else if (this.userType === '1' && this.type === '3') {
            arr = res.data.agent_notice_uuid_list
          }
          if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i]['order_uuid'] === this.orderUuid) {
                const noticeUuid = []
                noticeUuid.push(arr[i]['notice_uuid'])
                const data = qs.stringify({
                  notice_uuid: JSON.stringify(noticeUuid)
                })
                Vue.axios.post('readNotice', data)
                .then(() => {
                  // console.log(res)
                })
                break
              }
            }
          }
        }
        else {
          window.alert(res.msg)
        }
      }).catch((err) => {
        window.alert(err)
      })
    },
    getOrderDetail () {
      var data = qs.stringify({
        order_uuid: this.orderUuid,
        user_type: this.userType
      })
      Vue.axios.post('V4/getOrderDetail', data)
      .then((res) => {
        res = res.data
        const code = res.code
        if (code === '1') {
          // const required = res.data.serve_require
          // let arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'}
          // let requiredString = JSON.stringify(required).replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
          // return arrEntities[t]
          // })
          // this.res.data.serve_require = JSON.parse(requiredString)
          this.$nextTick(() => {
            this.res = res.data
          })
        }
        else {
          window.alert(res.msg)
        }
      }).catch((err) => {
        window.alert(err)
      })
    },
    YMDJSBridge_Serves (api, data) {
      if (this.type === '3') {
        data.model_name = 'agent'
      }
      else {
        data.model_name = ''
      }
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler(`YMDJSBridge_Serves_${api}`, data, () => {
          this.getOrderDetail()
        })
      })
    },
    orderApi (text, order, api) {
      let isOk = null
      if (text === '完成') {
        isOk = window.confirm('确认后钱就直接打到麻豆账号咯！')
      }
      else if (text === '取消') {
        isOk = window.confirm('确认取消订单吗？')
      }
      else if (text === '延时') {
        isOk = window.confirm('使用1次延长7天')
      }
      else {
        isOk = window.confirm(`确认${text}吗?`)
      }
      if (isOk) {
        let data = null
        if (this.type === '3') {
          data = qs.stringify({
            order_uuid: order.order_uuid,
            user_uuid: order.user_uuid
          })
        }
        else {
          data = qs.stringify({
            order_uuid: order.order_uuid
          })
        }
        Vue.axios.post(api, data)
        .then((response) => {
          response = response.data
          const code = response.code
          if (code === '1') {
            this.getOrderDetail()
            window.alert(`${text}成功!`)
            if (text === '完成') {
              if (this.userType === '1') {
                this.YMDJSBridge_Serves('ModelAppraise', order)
              }
              else if (this.userType === '2') {
                this.YMDJSBridge_Serves('MerchantAppraise', order)
              }
            }
          }
          else {
            window.alert(response.msg)
          }
        })
      }
    },
    orderPay (order) {
      const serveStartedAt = `${this.formatTime(order.serve_started_at)} 00:00:00`
      const serveEndAt = `${this.formatTime(order.serve_end_at)} 23:59:59`
      // const serveRequire = JSON.parse(order.serve_require)
      const data = {
        serve_started_at: serveStartedAt,
        serve_end_at: serveEndAt,
        serve_uuid: order.serve_uuid,
        order_uuid: order.order_uuid,
        target_uuid: order.target_uuid,
        serve_type: order.serve_type,
        deposit: order.deposit,
        price: order.per_price * order.number,
        month: order.month,
        number: order.number,
        serve_require: order.serve_require
      }
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_Serves_PlaceOrderPay', data, (res) => {
          if (res.result === undefined) {
            res = JSON.parse(res)
          }
          if (res.result === '1') {
            window.alert('支付成功!')
            this.getOrderDetail()
          }
          else if (res.result === '0') {
            window.alert('支付失败!')
          }
        })
      })
    },
    formatTime (value) {
      return new Date(parseInt(value) * 1000).toLocaleString().replace(/\//g, '-').substring(0, 9)
    }
  },
  filters: {
    formatTimeFilter (value) {
      return new Date(parseInt(value) * 1000).toLocaleString().replace(/\//g, '-').substring(0, 9)
    },
    toFixedZero (value) {
      return Number(value).toFixed(0)
    }
  },
  components: {
    headerBar
  }
}
</script>

<style lang="scss" scoped>
  #app {
    height: 100%;
  }
  .emptyLog {
    text-align: center;
    height: 15rem;
    line-height: 15rem;
    font-size: 1.4rem;
    color: #9b9b9b;
  }
  .list {
    padding: 0 1.5rem 10rem 1rem;
    font-size: 1.4rem;
    background: #fff;
  }
  .list > * {
    &:not(:last-child) {
      border-bottom: .1rem solid #f4f4f4;
    }
  }
  .list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 6rem;
    line-height: 6rem;
  }
  .list > div {
    h3 {
      height: 6rem;
      line-height: 6rem;
    }
    p {
      text-align: right;
      line-height: 2.5rem;
    }
  }
  .require-list {
    .text {
      padding: 1.5rem 1.5rem 2.5rem;
      background: #f0f0f0;
    }
    .photo-list {
      display: flex;
      flex-flow: wrap;
      margin: 1.5rem 0 2.5rem;
      .photo {
        width: 32%;
        height: 11.5rem;
        margin-bottom: .5rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        &:not(:nth-child(3n)) {
          margin-right: 2%;
        }
      }
    }
  }
  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5rem;
    line-height: 5rem;
    background: #fff;
    border-top: 1px solid #f4f4f4;
    font-size: 1.65rem;
    .fl {
      padding-left: 1.5rem;
      span:last-child {
        font-size: 2.4rem;
      }
    }
    .fr.pay {
      width: 13rem;
      text-align: center;
      background: #eb0044;
      color: #fff;
    }
    a {
      display: inline-block;
      width: 7rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      border: 1px solid #eb0044;
      border-radius: 1.5rem;
      font-size: 1.2rem;
      color: #eb0044;
      margin: 1rem 0 0 .8rem;
      &:nth-child(1) {
        margin-right: .8rem;
      }
      &.get-order {
        background-color: #eb0044;
        color: #fff;
      }
    }
  }
</style>
