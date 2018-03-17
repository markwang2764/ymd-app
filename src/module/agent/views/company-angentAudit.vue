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
        公司名称
      </div>
      <div class="right-input">
        <input type="text" v-model="companyName" placeholder="请输入">
      </div>
    </div>
    <div class="cell-wrapper border-1px">
      <div class="left-title">
        公司运营者姓名
      </div>
      <div class="right-input">
        <input :style="{color: textStyle}" type="text" v-model="companyUserName" placeholder="请输入">
      </div>
    </div>
    <div class="cell-wrapper border-1px">
      <div class="left-title">
        运营者电话
      </div>
      <div class="right-input">
        <input :style="{color: tellStyle}" @blur="verifyTell" @focus="restoreTell" type="tel" v-model="companyUserTell" placeholder="请输入">
      </div>
    </div>
    <div class="cell-wrapper card">
      <div class="left-title">
        运营者身份证
      </div>
      <div class="right-input">
      </div>
    </div>
    <div class="agentCard-wrapper">
      <div class="agentCard-list bg-img" v-for="(item, index) in userImages" @click="upLoadImg(index, 'user')" :style="'background-image: url(http://static.yunmadou.13980.com/' + item + ')'" :key="item.id">
        <span v-show='item === textList[index]'>＋</span>
        <span v-if = 'index < 2 && item === textList[index]'>身份证{{item}}</span>
        <span v-else-if = 'item === textList[index]'>手持身份证{{item}}</span>
      </div>
    </div>
    <div class="cell-wrapper card">
      <div class="left-title">
        公司营业执照(公司认证)
      </div>
      <div class="right-input">
      </div>
    </div>
    <div class="companyCard-wrapper">
      <div class="companyCard-list bg-img" v-for="(item,index) in companyImages" :style="'background-image: url(http://static.yunmadou.13980.com/' + item + ')'" @click="upLoadImg(index, 'company')" :key="item.id">
        <span v-show='item === textList[index]'>＋</span>
        <span v-if = 'index < 2 && item === textList[index]'>营业执照{{item}}</span>
        <span v-else-if = 'item === textList[index]'>手持营业执照{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import headerBar from '../common/header-bar.vue'
import footerBar from '../common/footer-bar.vue'
import popupShow from '../common/popup-show.vue'
import hintShow from '../common/hint-show.vue'
import { setupWebViewJavascriptBridge } from '../../../assets/js/common'
const cardImgArr = () => ['正面', '反面', '半身照']
let qs = require('qs')
import { mapGetters } from 'vuex'
export default {
  name: 'gogo',
  data () {
    return {
      title: '经纪公司认证',
      footText: '提交',
      succeed: false,
      popup: false,
      textStyle: '#000',
      tellStyle: '#000',
      companyName: '',
      companyUserName: '',
      companyUserTell: '',
      userImages: cardImgArr(),
      companyImages: cardImgArr()
    }
  },
  created () {
    if (this.companyType === '3') {
      this.companyName = this.company_info.company_name
      this.companyUserName = this.company_info.user_name
      this.companyUserTell = this.company_info.user_mobile
      this.userImages = this.company_info.user_images
      this.companyImages = this.company_info.company_images
      this.succeed = true
    } else if (this.companyType === '2') {
      this.succeed = true
    }
  },
  methods: {
    submitAudit () {
      let data = qs.stringify({
        user_images: JSON.stringify(this.userImages),
        company_images: JSON.stringify(this.companyImages),
        user_name: this.companyUserName,
        company_name: this.companyName,
        user_mobile: this.companyUserTell,
        is_person: 0
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
    upLoadImg (index, target) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_Callalbum', {
          count: '1'
        }, () => {})
        bridge.registerHandler('YMDJSBridge_fetchImg', (data) => {
          if (data.oss_url === undefined) {
            let url = JSON.parse(data).oss_url
            if (target === 'user') {
              this.userImages.splice(index, 1, url[0])
            } else {
              this.companyImages.splice(index, 1, url[0])
            }
          } else {
            let url = data.oss_url
            url = JSON.parse(url)
            if (target === 'user') {
              this.userImages.splice(index, 1, url[0])
            } else {
              this.companyImages.splice(index, 1, url[0])
            }
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
    //   if (!/^[\u4e00-\u9fa5]{2,}$/.test(this.companyUserName)) {
    //     this.textStyle = '#eb0044'
    //   }
    // },
    verifyTell () {
      if (!/^1(3|4|5|7|8)\d{9}$/.test(this.companyUserTell)) {
        this.tellStyle = '#eb0044'
      }
    }
  },
  computed: {
    ...mapGetters([
      'company_info',
      'companyType'
    ]),
    isOk () {
      if (/^1(3|4|5|7|8)\d{9}$/.test(this.companyUserTell) &&
        this.companyName !== '' && this.companyUserName !== '') {
        for (let i = 0; i < this.textList.length; i++) {
          if (this.userImages[i] === this.textList[i] || this.companyImages[i] === this.textList[i]) {
            return false
          }
        }
        return true
      }
    },
    hint () {
      if (this.succeed === true) {
        if (this.companyType === '2') {
          return '审核不通过，请重新提交'
        }
        return '审核中，请耐心等待'
      }
      return false
    },
    textList () {
      return cardImgArr()
    }
  },
  components: { headerBar, footerBar, popupShow, hintShow }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../../assets/css/wscss/commonStyle.scss";
</style>
