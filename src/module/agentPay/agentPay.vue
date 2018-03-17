<template>
    <div id="agentPay">
      <header-bar :back-to-app="true" :title="title"></header-bar>
      <div class="content">
        <img src="../../assets/img/person.svg">
        <div class="text">
        <p>恭喜你审核通过</p>
          支付经纪人费用<br>
          4999/年<br>
        </div>
        <div class="next">
          只差最后一步咯
        </div>
      </div>
      <div class="toPay" @click="payJSBridge">
        去支付
      </div>
    </div>
</template>

<script>
import headerBar from './common/header-bar.vue'
import { requestURLparas, setupWebViewJavascriptBridge } from '../../assets/js/common.js'
export default {
  name: 'agentPay',
  data () {
    return {
      title: '付费',
      type: '',
      totalPrice: '4999'
    }
  },
  created () {
    this.type = requestURLparas('type')
  },
  methods: {
    jumpTo () {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler(`YMDJSBridge_YunBeanLink`, {
          type: '17',
          user_type: '1'
        }, () => {})
      })
      // const funcArr = ['getToken', 'Back', 'MyInfoLink', 'YunBeanLink']
      // setupWebViewJavascriptBridge((bridge) => {
      //   bridge.callHandler('YMDJSBridge_JumpToMuti', {
      //     page: 'agentHomePage.html',
      //     func: funcArr
      //   }, () => {})
      // })
    },
    payJSBridge (e) {
      setupWebViewJavascriptBridge((bridge) => {
        e.preventDefault()
        bridge.callHandler('YMDJSBridge_AgentUpatePay', {
          agent_type: this.type,
          price: `${this.totalPrice}`
        }, (res) => {
          window.setTimeout(() => {
            if (res.result === undefined) {
              res = JSON.parse(res)
              if (res.result === '1') {
                this.jumpTo()
              }
            } else {
              if (res.result === '1') {
                this.jumpTo()
              }
            }
          }, 500)
        })
      })
    }
  },
  components: { headerBar }
}
</script>

<style lang="scss">
  #agentPay{
    height: 100%;
    width: 100%;
    text-align: center;
    img {
      display: block;
      width: 9.5rem;
      height: 11.5rem;
      margin: 0 auto;
      margin-top: 7.5rem;
    }
    .text{
      margin-top: 2rem;
      p{
        font-size: 3.6rem;
        line-height: 6rem;
      }
      font-size: 2.4rem;
      line-height: 3.5rem;
    }
    .next{
      font-size: 1.8rem;
      line-height: 5.4rem;
    }
    .toPay{
      height: 5rem;
      background: #eb0044;
      text-align: center;
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      line-height: 5rem;
      font-size: 1.7rem;
      color: #fff;
    }
  }
</style>
