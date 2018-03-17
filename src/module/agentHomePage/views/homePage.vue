<template lang="html">
<div id="agentHomePageIndex">
  <confirm-popup v-show="confirmDelMd">
    <div slot="popup-title" class="popup-title border-1px">真的要删除这位麻豆吗</div>
    <div slot="popup-content" class="popup-content">删除麻豆后，将不能恢复<br>
    只能重新添加</div>
    <div slot="popup-largeBtn" class="popup-largeBtn" @click="delMdfunc">删除麻豆</div>
    <div slot="popup-largeBtn" class="popup-largeBtn" @click="confirmDelMd = false">不了</div>
  </confirm-popup>
<div class="blur-bg" ref="blurBg">
  经纪人主页
    <span class="goBackToApp" :class="{black : scroll}" @touchstart="goBackToApp" ref="goBack"></span>
</div>
  <div class="headImg bg-img" :style="'background-image: url(' + AgentHomePageData.avatar_url + ')'">
  </div>
  <div class="content">
    <div class="header">
      <div class="name">
        {{info.user_name}}
          <i v-if="AgentHomePageData.company_verify === '1'" class="company"></i>
          <i v-if="AgentHomePageData.agent_verify === '1'" class="user"></i>
            </div>
            <div class="detail">
              {{info.city}} / {{title}}
            </div>
          </div>
          <div class="scope">
            <div class="name">
              服务范围
            </div>
            <div class="detail">
                <span v-for="item in scope" :style="{width: 1.1*item.length + 2.2 + 'rem'}">{{item}}</span>
            </div>
          </div>
    <div class="mdList">
        <div class="name">
          TA的麻豆 ({{users.length}})
        </div>
        <div class="detail" v-if="!users.length">
          还未添加麻豆
        </div>
        <div class="modeCard-list" v-else>
                <div class="modeCard" v-for="(item, index) in users">
                  <div class="img bg-img" @click="linkMdHome(item.user_uuid)" :style="'background-image: url(' + item.model_card[0].image + ')'">
                  </div>
                  <span class="delMdcard" @click="delMdShow(item.user_uuid)"></span>
                  <div class="not-verify" v-if="item.identity_verify === '2' || item.info_verify === '0' || item.price_verify === '2' || item.price_verify === '0'">
                    审核失败
                  </div>
                  <div class="not-verify" v-else-if="item.identity_verify !== '1' || item.info_verify !== '1' || item.price_verify !== '1'">
                    审核中
                  </div>

                  <div class="status" v-if="item.identity_verify === '1' && item.info_verify === '1' && item.price_verify === '1'">
                    <span class="name">
                      {{item.nickname}}
                    </span>
                    <span class="mdgrade" :class="'grade'+item.badge_type.match(/[123]/)"></span>
                    <span class="verify" :class="'isVerify'+item.identity_verify"></span>
                  </div>
                  <div class="status" v-else>
                    <span class="name">
                      {{item.nickname}}
                    </span>
                    <span class="mdgrade grade0"></span>
                    <span class="verify isVerify0"></span>
                  </div>

                  <div class="btn-mode gray" @click="goMdverify(item.user_uuid,item.info_verify,item.identity_verify,item.price_verify)" v-if="userUuid === '' && (item.identity_verify === '2' || item.info_verify === '0' || item.price_verify === '2' || item.price_verify === '0')">
                    审核失败，请重新提交
                  </div>
                  <div class="btn-mode gray" v-else-if="userUuid === '' && (item.identity_verify !== '1' || item.info_verify !== '1' || item.price_verify !== '1')">
                    审核中
                  </div>
                  <div class="btn-mode" @click="goModified(item.user_uuid, item.badge_type.match(/[123]/)[0],item.nickname)" v-else-if="userUuid === ''">
                    修改
                  </div>
              </div>
  <!--             <div class="mChat" v-if="userUuid !== ''">
    <div class="attention">
      <i></i>
      <span>关注</span>
    </div>
    <div class="goMchat" @click="">
      <i></i>
      <span>M聊</span>
    </div>
  </div> -->
        </div>
    </div>
  </div>
  <footer-bar v-if="userUuid === ''" :bgcolor="'#eb0044'" :text="footText" :name="'addMdIndex'"></footer-bar>
</div>
</template>


<script>
import { requestURLparas, setupWebViewJavascriptBridge } from '../../../assets/js/common'
import headerBar from '../common/header-bar.vue'
import footerBar from '../common/footer-bar.vue'
import confirmPopup from '../common/confirm-popup.vue'
import { mapGetters } from 'vuex'
import {eventHub} from '../eventhub.js'
export default {
  name: 'hello',
  data () {
    return {
      footText: '＋ 添加麻豆',
      active: false,
      userUuid: '',
      scroll: false,
      confirmDelMd: false,
      mdUuid: ''
    }
  },
  mounted () {
    window.onscroll = () => {
      let t = document.documentElement.scrollTop || document.body.scrollTop
      this.$refs.blurBg.style.setProperty('background-color', `rgba(255,255,255,${t / 220})`, 'important')
      this.$refs.blurBg.style.setProperty('font-size', '1.4rem', 'important')
      this.scroll = true
      if (t === 0) {
        this.$refs.blurBg.style.setProperty('background-color', `rgba(255,255,255,0)`, 'important')
        this.$refs.blurBg.style.setProperty('font-size', '0', 'important')
        this.scroll = false
      }
    }
  },
  created () {
    if (this.code === '-9') {
      alert(this.msg)
    }
    this.userUuid = requestURLparas('user_uuid')
    this.$store.dispatch('fetchAgentHomePage', {
      user_uuid: this.userUuid,
      type: 3
    })
  },
  activated () {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    eventHub.$emit('start')
  },
  deactivated () {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  },
  computed: {
    ...mapGetters([
      'AgentHomePageData',
      'info',
      'users',
      'scope',
      'title',
      'code',
      'msg'
    ])
  },
  methods: {
    delMdShow (id) {
      this.confirmDelMd = true
      this.mdUuid = id
    },
    delMdfunc () {
      let qs = require('qs')
      let data = qs.stringify({
        user_uuid: this.mdUuid
      })
      this.axios.post('V4/deleteModel', data, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      .then(res => {
        alert(res.data.msg)
        this.$store.dispatch('fetchAgentHomePage', {
          user_uuid: this.userUuid,
          type: 3
        })
        this.confirmDelMd = false
      })
    },
    selectName (e, name) {
      this.name = name
      this.active = true
      const auditList = document.getElementsByClassName('audit-hook')
      for (let i = 0; i < auditList.length; i++) {
        let item = auditList[i]
        item.className = 'audit-hook'
      }
      e.currentTarget.className = 'audit-hook opt'
    },
    goModified (id, index, name) {
      this.$router.push({ name: 'modifiedIndex', params: { userId: id, mdIndex: index, mdName: name } })
    },
    goMdverify (id, info, identity, price) {
      // console.log(id + ',' + info + ',' + identity + ',' + price)
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler(`YMDJSBridge_YunBeanLink`, {
          type: '15',
          user_type: '1',
          user_uuid: id,
          identity_verify: identity,
          info_verify: info,
          price_verify: price
        }, () => {})
      })
    },
    goBackToApp () {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_Back', {}, () => {})
      })
    },
    linkMdHome (id) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_MyInfoLink', {
          user_uuid: id
        }, () => {})
      })
    }
  },
  components: { headerBar, footerBar, confirmPopup }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../../assets/css/wscss/commonStyle.scss";
#agentHomePageIndex{
  position: relative;
}
  .content{
    .header,.scope,.mdList{
      padding: 0 2vw;
      background: #fff;
      padding-bottom: 2rem;
      margin-bottom: 1rem;
      .name{
        font-size: 2.4rem;
        height: 5.5rem;
        line-height: 5rem;
      }
      .detail{
        font-size: 1.4rem;
      }
    }
    .header{
      .name{
        .company,.user {
          background: url('../../../assets/img/certified_1.svg') no-repeat;
          display: inline-block;
          width: 5.1rem;
          height: 1.6rem;
          background-size: 5.1rem 1.6rem;
        }
        .user {
          background: url('../../../assets/img/certified_2.svg') no-repeat;
          background-size: 5.1rem 1.6rem;
        }
      }
    }
    .scope{
      .name{
        font-size: 1.4rem;
        color: rgba(0,0,0,.5);
      }
      .detail{
          span{
            margin-right: 1rem;
            font-size: 1.1rem;
            display: inline-block;
            height: 1.8rem;
            border: 1px solid #cecece;
            text-align: center;
            line-height: 1.7rem;
            border-radius: 1.7rem;
            display: inline-block;
            letter-spacing: .05rem;
          }
      }
    }
    .mdList{
      padding-bottom: 5rem;
      margin-bottom: 0;
      .name{
        font-size: 1.4rem;
        color: rgba(0,0,0,.5);
      }
      .detail{
        text-align: center;
        line-height: 8rem;
      }
      .modeCard-list{
        overflow: hidden;
        width: 100%;
        .delMdcard{
          background: url(../../../assets/img/delIcon.svg) no-repeat right 20% top 20%;
          background-size: 1.6rem 1.6rem;
          display: inline-block;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 999;
        }
        .mChat{
          height: 5rem;
          width: 100%;
          position: fixed;
          bottom: 0;
          left: 0;
          background: rgba(255,255,255,.9);
          border-top: 1px solid #dcddde;
          display: flex;
          justify-content: center;
          align-items: center;
          .attention,.goMchat{
            flex: 1;
            text-align: center;
            i{
              display: block;
              background: url(../../../assets/img/attention.svg) no-repeat;
              width: 1.6rem;
              height: 1.6rem;
              background-size: 1.6rem 1.6rem;
              margin: .2rem auto;
            }
          }
          .goMchat{
            i{
              background: url(../../../assets/img/mchat.svg) no-repeat;
              background-size: 1.6rem 1.6rem;
            }
          }
        }
        .modeCard {
          position: relative;
          width: 47vw;
          float: left;
          margin-bottom: 4rem;
          &.modeCard:nth-of-type(odd) {
            margin-right: 2vw;
          }
          .img{
            position: relative;
            z-index: 1;
            width: 100%;
            height: 62.51vw;
            background-color: #999;
          }
          .status{
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              flex: 1;
              height: 4rem;
              display: inline-block;
              &.name{
                flex: 0 0 4.2rem;
                line-height: 4rem;
                font-size: 1.4rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              &.mdgrade{
                flex: 1;
                width: 6.3rem;
                height: 1.6rem;
                &.grade0{
                  background: url('../../../assets/img/mdlv_0.svg') no-repeat;
                  background-size: 6.3rem 1.6rem;
                }
                &.grade1{
                  background: url('../../../assets/img/mdlv_1.svg') no-repeat;
                  background-size: 6.3rem 1.6rem;
                }
                &.grade2{
                  background: url('../../../assets/img/mdlv_2.svg') no-repeat;
                  background-size: 6.3rem 1.6rem;
                }
                &.grade3{
                  background: url('../../../assets/img/mdlv_3.svg') no-repeat;
                  background-size: 6.3rem 1.6rem;
                }
              }
              &.verify{
                flex:.8;
                width: 5rem;
                height: 1.6rem;
                &.isVerify1{
                  background: url('../../../assets/img/realname_2.svg') no-repeat;
                  background-size: 5rem 1.6rem;
                }
                &.isVerify0{
                  background: url('../../../assets/img/realname_1.svg') no-repeat;
                  background-size: 5rem 1.6rem;
                }
              }
              @media only screen and (max-width: 320px) {
                &.name{
                  flex: 0 0 3rem;
                }
                &.mdgrade{
                  flex: 1;
                  width: 6rem;
                  height: 1.6rem;
                  &.grade0{
                    background: url('../../../assets/img/mdlv_0.svg') no-repeat;
                    background-size: 6rem 1.6rem;
                  }
                  &.grade1{
                    background: url('../../../assets/img/mdlv_1.svg') no-repeat;
                    background-size: 6rem 1.6rem;
                  }
                  &.grade2{
                    background: url('../../../assets/img/mdlv_2.svg') no-repeat;
                    background-size: 6rem 1.6rem;
                  }
                  &.grade3{
                    background: url('../../../assets/img/mdlv_3.svg') no-repeat;
                    background-size: 6rem 1.6rem;
                  }
                }
                &.verify{
                  flex:.8;
                  width: 4.7rem;
                  height: 1.6rem;
                  &.isVerify1{
                    background: url('../../../assets/img/realname_2.svg') no-repeat;
                    background-size: 4.7rem 1.6rem;
                  }
                  &.isVerify0{
                    background: url('../../../assets/img/realname_1.svg') no-repeat;
                    background-size: 4.7rem 1.6rem;
                  }
                }
              }
            }
          }
          .btn-mode{
            width: 100%;
            height: 3rem;
            border-radius: 3rem;
            background: #eb0044;
            text-align: center;
            line-height: 3rem;
            color: #fff;
          }
          .btn-mode.gray {
            background: rgba(0,0,0,.5)
          }
        }
        .not-verify {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 99;
          width: 100%;
          height: 62.51vw;
          background-color: rgba(0,0,0,.5);
          line-height: 62.51vw;
          text-align: center;
          font-size: 1.4rem;
          color: #fff;
        }
      }
    }
  }

</style>
