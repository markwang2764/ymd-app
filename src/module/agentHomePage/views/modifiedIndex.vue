<template lang="html">
<div class="modifiedIndex">
  <span class="goback" @click="goback"></span>
  <img class="headImg" src="../../../assets/img/backimg.png">
  <div class="content">
    <div class="name">
      {{mdName}}
      <i class="icon" :class="'mdgrade'+grade"></i>
        <i class="icon realName2"></i>
    </div>
    <div class="index" @click="goToPrice">
      修改服务与报价
    </div>
    <div class="index" @click="goToApp">
      修改麻豆资料
    </div>
</div>
</div>
</template>


<script>
import headerBar from '../common/header-bar.vue'
import footerBar from '../common/footer-bar.vue'
import {eventHub} from '../eventhub.js'
import { mapGetters } from 'vuex'
import { setupWebViewJavascriptBridge } from '../../../assets/js/common'
export default {
  name: 'addMdIndex',
  data () {
    return {
      title: '添加麻豆',
      footText: '下一步',
      name: null,
      active: false,
      userId: '',
      grade: '',
      mdName: '',
      mdVerify: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.userId = vm.$route.params.userId
      vm.grade = vm.$route.params.mdIndex
      vm.mdName = vm.$route.params.mdName
    })
  },
  mounted () {
  },
  methods: {
    jumpTo () {
      const funcArr = ['getToken', 'Back', 'Callalbum', 'Serves_MChat']
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_JumpToMuti', {
          page: `price.html?user_uuid=${this.userId}`,
          func: funcArr
        }, () => {})
      })
    },
    goToPrice () {
      this.jumpTo()
    },
    goToApp () {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler(`YMDJSBridge_YunBeanLink`, {
          type: '16',
          user_type: '1',
          user_uuid: this.userId
        }, () => {})
      })
    },
    goback () {
      window.history.go(-1)
      eventHub.$emit('none')
    },
    selectName (e, name) {
      this.active = true
      e.currentTarget.className = 'audit-hook opt'
    }
  },
  computed: {
    ...mapGetters([
      'AgentHomePageData'
    ])
  },
  components: { headerBar, footerBar }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../../assets/css/wscss/commonStyle.scss";
.modifiedIndex {
  position: relative;
  .content {
    height: 70vh;
    width: 100vw;
    background: #fff;
    position: absolute;
    top: 30vh;
    left: 0;
    .name{
      position: relative;
      text-align: center;
      height: 17rem;
      padding: 4.5rem 0;
      font-size: 2.4rem;
      .icon {
        position: absolute;
        left:41%;
        top: 50%;
        margin-left: -3.15rem;
        display: block;
        width: 6.3rem !important;
        height: 1.6rem !important;
      }
      .mdgrade1 {
        background: url('../../../assets/img/mdlv_1.svg') no-repeat;
        background-size: 6.3rem 1.6rem;
      }
      .mdgrade2 {
        background: url('../../../assets/img/mdlv_2.svg') no-repeat;
        background-size: 6.3rem 1.6rem;
      }
      .mdgrade3 {
        background: url('../../../assets/img/mdlv_3.svg') no-repeat;
        background-size: 6.3rem 1.6rem;
      }
      .realName2{
        left:59%;
        background: url('../../../assets/img/realname_2.svg') no-repeat;
        background-size: 6.3rem 1.6rem;
      }
    }
    .index{
      width: 30rem;
      margin: 0 auto 2rem auto;
      height: 4rem;
      text-align: center;
      border-radius: 4rem;
      background: $red;
      color: #fff;
      font-size: 1.6rem;
      line-height: 4rem;
    }
  }
}
</style>
