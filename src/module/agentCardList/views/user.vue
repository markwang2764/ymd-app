<template>
  <div class="userCardList">
      <scroller style="top: 0px"
                :on-refresh="refresh"
                :on-infinite="infinite"
                ref="my_scroller"
                class="scroller">
      <div class="clearfix Card-wrapper">
              <div v-for="(item, index) in cards" class="card-list">
    <!--   ☟经纪人列表 -->
              <div @click="jumpToAgentHomePage(item.user_uuid)" class="img-wrapper bg-img" :style="'background-image: url(' + item.image + ')'">
              </div>
              <div class="agent-desc">
                <span class="name">{{item.nickname}}</span>
                <span class="icon-box">
                </span>
                <span></span>
              </div>
    <!--   ☝︎ -->
              </div>
      </div>
      </scroller>
  </div>
</template>

<script>
import { setupWebViewJavascriptBridge } from '../../../assets/js/common.js'
import Scroller from 'vue-scroller'
let qs = require('qs')
export default {
  name: 'user',
  data () {
    return {
      items: {},
      cards: [],
      page: 1,
      per_page: '',
      tag_code: '',
      bottom: 0,
      timer: 0,
      x: 0,
      y: 0,
      to_Top: false
    }
  },
  created () {
    setupWebViewJavascriptBridge((bridge) => {
      bridge.callHandler('YMDJSBridge_getToken', {}, (res) => {
        if (res.token) {
          this.$http.headers.common.token = res.token
        }
      })
    })
    this.getModelCardList(this.page)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    this.$refs.my_scroller.finishInfinite(true)
    this.timer = setInterval(() => {
      let {left, top} = this.$refs.my_scroller.getPosition()
      this.x = left
      this.y = top
    }, 50)
  },
  watch: {
    y (to) {
      if (to > 300) {
        this.to_Top = true
      } else {
        this.to_Top = false
      }
    }
  },
  computed: {
  },
  methods: {
    jumpToAgentHomePage (userUuid) {
      const funcArr = ['getToken', 'Back', 'Callalbum', 'Serves_MChat']
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_JumpToMuti', {
          page: `agentHomePage.html?user_uuid=${userUuid}`,
          func: funcArr
        }, () => {})
      })
    },
    getModelCardList (pg) {
      let data = qs.stringify({
        tag_code: 'T88888888886',
        page: pg,
        type: 3
      })
      this.axios.post('modelCardList', data).then((res) => {
        this.per_page = res.data.per_page
        if (pg !== 1) {
          this.cards = this.cards.concat(res.data.data)
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.my_scroller.finishInfinite()
            })
          })
        } else {
          this.cards = res.data.data
        }
        this.$nextTick(() => {
          this.$refs.my_scroller.resize()
        })
        setupWebViewJavascriptBridge((bridge) => {
          bridge.callHandler('YMDJSBridge_modelCardList', {
            data: this.cards
          }, () => {})
        })
      })
    },
    goTo_top () {
      this.$refs.my_scroller.scrollTo(0, 0, true)
    },
    refresh () {
      setTimeout(() => {
        this.page = 1
        this.getModelCardList(this.page)
        if (this.$refs.my_scroller) {
          this.$refs.my_scroller.finishPullToRefresh()
        }
      }, 1500)
    },
    infinite () {
      if (this.page >= this.per_page) {
        setTimeout(() => {
          this.$refs.my_scroller.finishInfinite(true)
        }, 1500)
        return
      }
      this.page++
      setTimeout(() => {
        this.getModelCardList(this.page)
      }, 500)
    }
  },
  components: {
    Scroller
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.icon-box{
  background: url('../../../assets/img/certified_2.svg') no-repeat !important;
  background-size: contain !important;
  height: 1.6rem !important;
  margin-left: .5rem !important;
}
</style>
