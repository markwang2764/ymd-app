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
              <div @click="showModel(index)" class="img-wrapper bg-img" :style="'background-image: url(' + item.image + ')'">
              </div>
              <div class="agent-desc">
                <span class="name">{{item.nickname}}</span>
                <span class="mdgrade" :class="'mdGrade' + item.grade.join('').match(/[123]/)"></span>
                <span class="icon-box" :class="'icon-box' + item.identity_verify">
                </span>
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
      bridge.callHandler('YMDJSBridge_getTagCode', {}, (res) => {
        if (res.tag_code === undefined) {
          res = JSON.parse(res)
          this.tag_code = res.tag_code
        } else {
          this.tag_code = res.tag_code
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
    showModel (modelCardindex) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_showModel', {
          index: `${modelCardindex}`
        }, () => {})
      })
    },
    getModelCardList (pg) {
      let data = qs.stringify({
        tag_code: this.tag_code,
        page: pg,
        type: 1
      })
      this.axios.post('modelCardList', data).then((res) => {
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
      if (this.page >= 10) {
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

.icon-box0{
  background: url('../../../assets/img/realname_1.svg') no-repeat !important;;
}
.icon-box1{
  background: url('../../../assets/img/realname_2.svg') no-repeat !important;
}
.icon-box {
  height: 1.6rem !important;
  background-size: 5rem 1.6rem !important;
  margin-left: .5rem;
}

.mdGrade1{
  background: url('../../../assets/img/mdlv_1.svg') no-repeat !important;
}
.mdGrade2{
  background: url('../../../assets/img/mdlv_2.svg') no-repeat !important;
}
.mdGrade3{
  background: url('../../../assets/img/mdlv_3.svg') no-repeat !important;
}
.mdgrade{
  height: 1.6rem !important;
  background-size: 6.5rem 1.6rem !important;
}
@media only screen and (max-width: 320px) {
  .name{
    flex: 0 0 3rem !important;
    font-size: 1.1rem !important;
  }
  .icon-box {
    height: 1.5rem !important;
    background-size: 4.5rem 1.5rem !important;
    margin-left: .5rem;
  }
  .mdgrade{
    height: 1.5rem !important;
    background-size: 5.5rem 1.5rem !important;
  }
}
@media only screen and (max-width: 375px) and (min-width: 321px) {
  .name{
    flex: 0 0 4.5rem !important;
  }
}
@media only screen and (max-width: 414px) and (min-width: 378px) {
  .name{
    flex: 0 0 6rem !important;
  }
}
</style>
