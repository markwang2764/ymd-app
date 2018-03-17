<template lang="html">
<div id="modelCartAdd">
  <header-bar :back-to-app="true" :title="title" :hint="'清空'"></header-bar>
  <div class="modelList" v-for="(item, index) in mdCartList">
    <div class="sliderbox border-1px">
      <div class="checkBox" @click="selectMd(index,item.user_uuid)">
        <i class="circle" :class="{red: targetUuid[index]}"></i>
      </div>
      <div class="content userlist">
        <span @click="modelHomePage(item.user_uuid)" class="headPortrait" :style="'background-image: url(' + item.avatar_url + ')'"></span>
        <span class="name">{{item.nickname}}</span>
        <i class="mdlv" :class="'mdlv' + item.grade.join('').match(/[123]/)"></i>
        <i class="realname"></i>
      </div>
    </div>
    <div class="del" @click="delCart(item.user_uuid)">
      删除
    </div>
  </div>
  <div class="footBar" v-show = "mdCartList">
    <div class="num">
      <div class="checkBox" @click="ckAll">
        <i class="circle" :class="{red: mdCartList.length === target_uuid.length}"></i>
      </div>
      全选 ({{target_uuid.length}}/{{mdCartList.length}})
    </div>
    <div class="goPay" @click="goToPay" :class="{red: target_uuid.length !== 0}">
      去下单
    </div>
  </div>
</div>
</template>


<script>
import { touchSlider } from '../../../assets/js/slider'
import headerBar from '../common/header-bar.vue'
import { setupWebViewJavascriptBridge } from '../../../assets/js/common'
// import * as types from '../../../store/types'
let qs = require('qs')
export default {
  name: 'cart',
  data () {
    return {
      title: '麻豆车',
      footText: '＋ 添加麻豆',
      active: false,
      userUuid: '',
      scroll: false,
      checked: false,
      cartId: '',
      mdCartList: '',
      targetUuid: []
    }
  },
  created () {
  },
  mounted () {
    this.getCart()
  },
  computed: {
    target_uuid () {
      let arr = []
      for (let i = 0; i < this.targetUuid.length; i++) {
        if (this.targetUuid[i]) {
          arr.push(this.targetUuid[i])
        }
      }
      return arr
    }
  },
  methods: {
    modelHomePage (id) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_MyInfoLink', {
          user_uuid: id
        }, () => {})
      })
    },
    clearAll () {
      if (confirm('确认删除')) {
        let userId = []
        for (let i in this.mdCartList) {
          userId.push(this.mdCartList[i].user_uuid)
        }
        this.delCart(userId)
      }
    },
    delCart (id) {
      if (typeof (id) === 'string') {
        let arr = []
        arr.push(id)
        id = arr
      }
      id = JSON.stringify(id)
      let data = qs.stringify({
        user_uuid: id
      })
      this.axios.post('/V4/deleteCart', data, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      .then(res => {
        alert(res.data.msg)
        this.getCart().then(() => {
          let userId = []
          for (let i in this.mdCartList) {
            userId.push(this.mdCartList[i].user_uuid)
          }
          setupWebViewJavascriptBridge((bridge) => {
            bridge.callHandler('YMDJSBridge_ModelCart', {
              user_uuid: userId
            }, () => {})
          })
        })
      })
    },
    getCart () {
      return new Promise((resolve, reject) => {
        this.axios.post('/V4/serveCartList')
        .then(res => {
          resolve(res.data.data)
          this.mdCartList = res.data.data
          this.cartId = res.data.cart_id
          this.$nextTick(() => {
            touchSlider('.modelList')
          })
        })
      })
    },
    selectMd (index, id) {
      this.targetUuid.length = this.mdCartList.length
      if (this.targetUuid[index]) {
        this.targetUuid.splice(index, 1, null)
      } else {
        this.targetUuid.splice(index, 1, id)
      }
    },
    ckAll () {
      if (this.target_uuid.length !== this.mdCartList.length) {
        let arr = []
        for (let i = 0; i < this.mdCartList.length; i++) {
          arr.push(this.mdCartList[i].user_uuid)
        }
        this.targetUuid = arr
      } else {
        this.targetUuid = []
      }
    },
    goToPay () {
      if (this.target_uuid.length !== 0) {
        let qs = require('qs')
        let data = qs.stringify({
          target_uuid: JSON.stringify(this.target_uuid)
        })
        this.axios.post('V4/getCartServeType', data)
        .then(res => {
          this.$store.commit('setCartData', res.data)
          if (this.$store.state.modelCart._cartCode === '1') {
            this.$router.push({ name: 'serveType', params: {id: this.cartId} })
          }
        })
      } else {
        return
      }
    }
  },
  components: { headerBar }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../../assets/css/wscss/mixin.scss";
.content.userlist {
    height: inherit;
}
.footBar{
  height: 7vh;
  position: fixed;
  width: 100vw;
  top: 93vh;
  display: flex;
  line-height: 7vh;
  box-shadow: 0 -1px 5px rgba(0,0,0,.2);
  font-size: 1.6rem;
  z-index: 1000;
  .num{
    flex: 2;
    background:#fff;
    text-align: center;
    position: relative;
    .checkBox{
      position: absolute;
      left: 0;
      height: 100%;
      width: 50%;
      .circle {
        border-radius: 50%;
        width: 1.6rem;
        height: 1.6rem;
        border: 1px solid rgba(0,0,0,.2);
        position: absolute;
        left: 1rem;
        top: 50%;
        margin-top: -.8rem;
        &.red{
          background: url('../../../assets/img/redCk.svg') no-repeat;
          background-size: cover;
          border: none;
        }
      }
      @media only screen and (max-width: 320px) {
        .circle {
          left: .5rem;
        }
      }
    }
  }
  .goPay{
    flex: 3;
    background:#fff;
    text-align: center;
    background: #ffccda;
    color: #fff;
    &.red{
      background: #Eb0044;
    }
  }
}
@media only screen and (max-width: 320px) {
  .footBar {
    top: 91.5vh;
    height: 8.5vh;
    line-height: 8.5vh;
  }
}
#modelCartAdd {
  height: 100vh;
  width: 100vw;
  background: #fff;
  padding-bottom: 10vh;
}
.modelList{
  position: relative;
  width: 100%;
  height: 10rem;
}

.sliderbox{
  @include border-1px(rgba(0,0,0,.1));
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  background: #fff;
  span,i{
    display: inline-block;
  }
  .checkBox{
    display: inline-block;
    flex: 0 0 4.5rem;
    height: 100%;
    width: 100%;
  }
  .circle {
    border-radius: 50%;
    width: 1.6rem;
    height: 1.6rem;
    border: 1px solid rgba(0,0,0,.2);
    position: absolute;
    left: 1rem;
    top: 50%;
    margin-top: -.8rem;
    &.red{
      background: url('../../../assets/img/redCk.svg') no-repeat;
      background-size: cover;
      border: none;
    }
  }
}
.del {
  position: absolute;
  z-index: 0;
  right: 0rem;
  background: #eb0044;
  width: 10rem;
  margin-top: .1rem;
  height: 9.8rem;
  font-size: 1.4rem;
  line-height: 10rem;
  text-align: center;
  color: #fff;
}

</style>
