<template>
    <div id="agentAlliance">
      <header-bar :back-to-app="true" :title="title"></header-bar>
      <div class="content">
        <img src="../../assets/img/person.svg">
        <div class="text">
          经纪人联盟<br>
        </div>
        <div class="next">
          您已成功添加{{num}}位麻豆
        </div>
        <div class="gotoApp" @click="GroupMChat">
          进群
        </div>
      </div>
    </div>
</template>

<script>
import headerBar from './common/header-bar.vue'
import { requestURLparas, setupWebViewJavascriptBridge } from '../../assets/js/common.js'
export default {
  name: 'agentAlliance',
  data () {
    return {
      title: '经济联盟',
      num: 0
    }
  },
  created () {
    this.num = requestURLparas('num')
  },
  methods: {
    GroupMChat (e) {
      setupWebViewJavascriptBridge((bridge) => {
        e.preventDefault()
        bridge.callHandler('YMDJSBridge_Serves_GroupMChat', {
          groupId: '14811075928509927',
          groupName: '经纪人联盟 '
        }, () => {})
      })
    }
  },
  components: { headerBar }
}
</script>

<style lang="scss">
  #agentAlliance{
    height: 100%;
    width: 100%;
    text-align: center;
    img {
      display: block;
      width: 4rem;
      height: 4rem;
      margin: 0 auto;
      margin-top: 13.5rem;
      border-radius: 50%;
    }
    .text{
      margin-top: 2rem;
      font-size: 2.4rem;
      line-height: 3.5rem;
    }
    .next{
      font-size: 1.4rem;
      line-height: 3.5rem;
      color: rgba(0,0,0,.5);
    }
    .gotoApp{
      width: 80vw;
      height: 4rem;
      background: #eb0044;
      margin: 6rem auto 0 auto;
      border-radius: 4rem;
      font-size: 1.4rem;
      color: #fff;
      line-height: 4rem;
    }
  }
</style>
