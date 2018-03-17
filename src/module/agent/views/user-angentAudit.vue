<template>
  <div class="agentAudit">
  <header-bar :back-to-web="true" :title="title"></header-bar>
  <footer-bar v-show="hint !== '审核中，请耐心等待'">
    <div slot="submit-audit" :class="{'active': isOk}"  class="submit-audit" @click="submitAudit">
      提交
    </div>
  </footer-bar>
  <popup-show v-show="succeed&&popup">
    <div slot="popup-title" class="popup-title border-1px">请等待审核</div>
    <div slot="popup-content" class="popup-content">您的经纪人认证，正搭乘专机飞往云麻豆星球<br>
    请耐心等待审核结果呦</div>
    <div slot="popup-largeBtn" class="popup-largeBtn" @click="noWaitReview">知道啦</div>
  </popup-show>
  <hint-show :text="hint" v-show="hint"></hint-show>
  <div class="cell-wrapper border-1px">
    <div class="left-title">
      姓名
    </div>
    <div class="right-input">
      <input :style="{color: textStyle}" type="text" v-model="agentName" placeholder="请输入">
    </div>
  </div>
  <div class="cell-wrapper border-1px">
    <div class="left-title">
      电话
    </div>
    <div class="right-input">
      <input :style="{color: tellStyle}" @blur="verifyTell" @focus="restoreTell" type="tel" v-model="agentTell" placeholder="请输入">
    </div>
  </div>
  <div class="cell-wrapper card">
    <div class="left-title">
      身份证
    </div>
    <div class="right-input">
    </div>
  </div>
  <div class="agentCard-wrapper">
    <div class="agentCard-list bg-img" v-for="(item, index) in userImages"
     :style="'background-image: url(http://static.yunmadou.13980.com/' + item + ')'" @click="upLoadImg(index)" :key="item.id">
      <span v-show='item === textList[index]'>＋</span>
      <span v-show='item === textList[index]'>{{item}}</span>
    </div>
  </div>
</div>
</template>

<script>
import headerBar from '../common/header-bar.vue'
import footerBar from '../common/footer-bar.vue'
import popupShow from '../common/popup-show.vue'
import hintShow from '../common/hint-show.vue'
const cardImgArr = () => ['身份证正面', '身份证反面', '手持身份证半身照']
let qs = require('qs')
import { setupWebViewJavascriptBridge } from '../../../assets/js/common'
import { mapGetters } from 'vuex'

export default {
  name: 'gogo',
  data () {
    return {
      title: '经纪个人认证',
      footText: '提交',
      succeed: false,
      popup: false,
      textStyle: '#000',
      tellStyle: '#000',
      agentName: '',
      agentTell: '',
      userImages: cardImgArr()
    }
  },
  created () {
    if (this.userType === '3') {
      this.agentName = this.user_info.user_name
      this.agentTell = this.user_info.user_mobile
      this.userImages = this.user_info.user_images
      this.succeed = true
    } else if (this.userType === '2') {
      this.succeed = true
    }
  },
  methods: {
    submitAudit () {
      let data = qs.stringify({
        user_images: JSON.stringify(this.userImages),
        user_name: this.agentName,
        user_mobile: this.agentTell,
        is_person: 1
      })
      if (this.isOk) {
        this.axios.post('/V4/companyIdentityApply', data, {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(res => {
          if (res.data.code === '1') {
            this.succeed = true
            this.popup = true
            this.$store.dispatch('fetchAgentType')
          }
        })
      } else {
        return
      }
    },
    noWaitReview () {
      this.popup = false
    },
    upLoadImg (index) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_Callalbum', {
          count: '1'
        }, () => {})
        bridge.registerHandler('YMDJSBridge_fetchImg', (data) => {
          if (data.oss_url === undefined) {
            let arrUrl = JSON.parse(data).oss_url
            this.userImages.splice(index, 1, arrUrl[0])
          } else {
            let arrUrl = data.oss_url
            arrUrl = JSON.parse(arrUrl)
            this.userImages.splice(index, 1, arrUrl[0])
          }
        })
      })
    },
    // restoreName () {
    //   this.textStyle = '#000'
    // },
    restoreTell () {
      this.tellStyle = '#000'
    },
    // verifyName () {
    //   if (!/^[\u4e00-\u9fa5]{2,}$/.test(this.agentName)) {
    //     this.textStyle = '#eb0044'
    //   }
    // },
    verifyTell () {
      if (!/^1(3|4|5|7|8)\d{9}$/.test(this.agentTell)) {
        this.tellStyle = '#eb0044'
      }
    }
  },
  computed: {
    isOk () {
      if (/^1(3|4|5|7|8)\d{9}$/.test(this.agentTell) &&
        this.agentName !== '') {
        for (let i = 0; i < this.userImages.length; i++) {
          if (this.userImages[i] === this.textList[i]) {
            return false
          }
        }
        return true
      }
    },
    hint () {
      if (this.succeed === true) {
        if (this.userType === '2') {
          return '审核不通过，请重新提交'
        }
        return '审核中，请耐心等待'
      }
      return false
    },
    textList () {
      return cardImgArr()
    },
    ...mapGetters([
      'user_info',
      'userType'
    ])
  },
  components: { headerBar, footerBar, popupShow, hintShow }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../../assets/css/wscss/commonStyle.scss";
.agentCard-wrapper {
  margin-bottom: 7rem !important;
}
.submit-audit{
  background: $pink;
  &.active{
    background: $red;
  }
}
</style>
