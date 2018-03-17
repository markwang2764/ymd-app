<template lang="html">
  <header>
    <div class="header-bar">
      <div v-if="!backToApp&&!backToServeList" class="empty"></div>
      <div v-if="backToApp" class="back back-to-app" @click="goBackToApp"><a></a></div>
      <div v-if="backToServeList" class="back back-to-serve-list" @click="goBackToServeList"><a></a></div>
      <div class="bar-title" v-text="title"></div>
      <div class="empty"></div>
    </div>
    <div class="fixedHeight50"></div>
  </header>
</template>

<script>
import { setupWebViewJavascriptBridge } from 'assets/js/common'

export default {
  props: {
    title: {
      type: String
    },
    backToApp: {
      type: Boolean
    },
    backToServeList: {
      type: Boolean
    },
    userType: {
      type: String
    },
    type: {
      type: String
    }
  },
  methods: {
    goBackToApp () {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_Back', {}, () => {})
      })
    },
    goBackToServeList () {
      setupWebViewJavascriptBridge((bridge) => {
        const funcArr = [
          'getToken',
          'Back',
          'Serves_MChat',
          'Serves_CustomerServe',
          'Serves_MerchantAppraise',
          'Serves_CustomerServe',
          'Serves_PlaceOrderPay',
          'Serves_ModelPay',
          'Serves_ModelAppraise',
          'Serves_MerchantAppraise',
          'modelHomePage',
          'JumpToMuti',
          'reloadMyCenter'
        ]
        bridge.callHandler('YMDJSBridge_JumpToMuti', {
          page: `service.html?user_type=${this.userType}&status=2`,
          func: funcArr
        }, () => {})
        bridge.callHandler('YMDJSBridge_Back', {}, () => {})
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fixedHeight50 {
  height: 5rem;
}
.header-bar {
  display: flex;
  height: 5rem;
  line-height: 5rem;
  font-size: 1.6rem;
  background: #fff;
  border-bottom: 1px solid #f4f4f4;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  >div {
    display: flex;
    flex: 1;
    height: 100%;
    &.back {
      align-items: center;
      a {
        display: inline-block;
        height: 2rem;
        width: 1.6rem;
        margin-left: 1.5rem;
        background-image: url(../../../assets/img/back.svg);
        background-repeat: no-repeat;
        background-size: 60%;
      }
    }
    &.bar-title {
      justify-content: center;
      flex: 2;
    }
  }
}
</style>
