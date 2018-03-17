<template lang="html">
  <div class="paymentOrder">
    <header-bar :back-to-web="true" :title="title"></header-bar>
    <div class="creat-order">
       <div class="serve-type border-1px">
           <div class="fl">服务名称</div>
           <div class="btn fr">
             {{serveName}}
           </div>
       </div>

<div class="serve-count border-1px">
     <div class="fl">服务条数</div>
     <div class="btn count fr">
     </div>
    <div class="clearfix"></div>
    <div class="count-wrapper">
       <button @click="serveCount<=1?serveCount=1 : serveCount--">－</button>
       <span>{{serveCount}}</span>
       <button @click="serveCount++">＋</button>
    </div>
</div>

<div class="serve-require border-1px">
     <div class="fl">服务要求</div>
     <div class="btn count fr">
     </div>
    <div class="clearfix"></div>
     <div v-for = "(item, index) in serve_require">
          <div class="require-wrapper">
           <textarea
           style='overflow:scroll;overflow-y:hidden;;overflow-x:hidden' class="area" v-model="item.Desc" placeholder="请输入要求"></textarea>
          </div>
          <div class="pic-wrapper">
              <swiper class="photo-list" :options="swiperOption" ref="mySwiperA">
                <swiper-slide class="swiper-item" v-for="imgList in item.PhotoArr" :key="item.id">
                  <div @click.stop="lookBigPicture(index)" class="pic-desc bg-img" :style="'background-image: url(http://static.yunmadou.13980.com/' + imgList + ')'">
                  </div>
                </swiper-slide>
               <swiper-slide class="swiper-item">
                 <div class="pic-desc input-box" :key="item.id">
                   <input v-if="item.PhotoArr.length < 9" type="file" @click="upLoadImg(index)">
                   <span v-if="item.PhotoArr.length < 9">＋</span>
                   <span v-else>🚫</span>
                   <span v-if="item.PhotoArr.length < 9">添加示意图最多{{9 - item.PhotoArr.length}}张</span>
                   <span v-else>已经到9张了</span>
                 </div>
               </swiper-slide>
              </swiper>
          </div>
          <div class="add-del">
            <button type="button" class="del" @click="delRequire(index)" v-show="serve_require.length > 1">删除</button>
            <button type="button" class="add" @click="addRequire" v-show="index + 1 === serve_require.length">再加一条</button>
          </div>
    </div>
</div>

<div class="serve-date border-1px">
    <div>服务截止时间</div>
      <div class="data-wrapper">
        <div class="started datewrapper fl">
          <group>
            <datetime
            @on-change="endDate"
            v-model="limitHourValue"
            :start-date="nowtime"
            format="YYYY-MM-DD"
            title="请选择"
            :min-year=2017
            :max-year=2020
            confirm-text="确认"
            cancel-text="取消">
            </datetime>
          </group>
        </div>
      </div>
</div>
<div class="serve-deposit border-1px">
  <div class="fl">麻豆需付押金<span>选填</span></div>
  <div class="btn count fr">
    <span :class="{'oinput': deposit }">￥</span>
    <input @keyup="onlyNum($event)"
     v-model="deposit" type="number" placeholder="请输入">
  </div>
</div>

<div class="serve-amount border-1px" v-for = "item in commonData">
     <div class="content userlist">
       <span class="headPortrait" :style="'background-image: url(' + item.user_info.avatar_url + ')'"></span>
       <span class="name">{{item.user_info.nickname}}</span>
       <i class="mdlv" :class="'mdlv' + item.user_info.grade.join('').match(/[123]/)"></i>
       <i class="realname"></i>
 </div>
    <div class="btn fr clearfix">
      <div class="count">
        {{serveName}}&nbspx{{serveCount}}
      </div>
       <div class="price">
         ￥ {{item.price_list.price*serveCount}}
       </div>
    </div>
</div>
    </div>
    <div class="goPay">
      <div class="total">
      合计：<span>￥ {{totalPrice}}
 <span>
 </span>
      </span>
      </div>
      <div class="paybtn" :class="{'active': activePay}" @click="payJSBridge">
      去支付
      </div>
    </div>
  </div>
</template>


<script>
import headerBar from '../common/header-bar.vue'
import footerBar from '../common/footer-bar.vue'
import { Datetime, Group } from 'vux'
import { mapGetters } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { setupWebViewJavascriptBridge } from '../../../assets/js/common'

export default {
  name: 'payMent',
  data () {
    return {
      title: '付款',
      swiperOption: {
        width: 115,
        spaceBetween: 10,
        freeMode: true
      },
      endvalue: '请选择',
      month: '1',
      limitHourValue: '请选择',
      serveCount: 1,
      deposit: '',
      cartId: '',
      serve_require: [
        {
          Desc: '',
          PhotoArr: []
        }
      ],
      photoCount: 9,
      depositactive: false,
      photoShowArr: null
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.cartId = vm.$route.params.id
      vm.deposit = ''
      vm.endvalue = '请选择'
      vm.limitHourValue = '请选择'
    })
  },
  mounted () {
  },
  activated () {
    this.$nextTick(() => {
      this.setHeight()
    })
  },
  methods: {
    setHeight () {
      let areas = document.querySelectorAll('.area')
      console.log(areas)
      let height = 11
      for (let i = 0; i < areas.length; i++) {
        let box = areas[i]
        let a = 0
        box.onscroll = () => {
          if ((a - box.scrollTop) < 0) {
            height += 5
            box.style.height = height + 'rem'
            a = box.scrollTop
          } else if ((a - box.scrollTop) > 0) {
            console.log('向下' + (a - box.scrollTop))
          }
        }
      }
    },
    lookBigPicture (index) {
      let photo = []
      for (let v in this.photoShowArr[index].PhotoArr) {
        photo.push('http://static.yunmadou.13980.com/' + this.photoShowArr[index].PhotoArr[v])
      }
      const data = {
        photos: photo
      }
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_ShowGallery', data, () => {})
      })
    },
    payJSBridge (e) {
      // if (this.activePay) {
      //   if (this.deposit !== '' && !this.depositVerify) {
      //     alert('麻豆押金必须为正整数')
      //     return
      //   }
      //   let qs = require('qs')
      //   let data = qs.stringify({
      //     serve_end_at: `${this.endvalue} 23:59:59`,
      //     cart_uuid: this.cartId,
      //     serve_uuid: JSON.stringify(this.serve_uuid),
      //     target_uuid: JSON.stringify(this.target_uuid),
      //     serve_type: this.serve_type,
      //     deposit: `${this.deposit}`,
      //     price: `${this.totalPrice}`,
      //     month: `${this.month}`,
      //     number: `${this.serveCount}`,
      //     serve_require: JSON.stringify(this.serve_require)
      //   })
      //   this.axios.post('/V4/serveOrderCreateAll', data, {
      //     headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
      //   .then(res => {
      //     alert(res.data.msg)
      //   })
      // }

      if (this.activePay) {
        if (this.deposit !== '' && !this.depositVerify) {
          alert('麻豆押金必须为正整数')
          return
        }
        setupWebViewJavascriptBridge((bridge) => {
          e.preventDefault()
          bridge.callHandler('YMDJSBridge_Serves_PlaceOrderBatchPay', {
            serve_end_at: `${this.endvalue} 23:59:59`,
            cart_uuid: this.cartId,
            serve_uuid: this.serve_uuid,
            target_uuid: this.target_uuid,
            serve_type: this.serveType,
            deposit: `${this.deposit}`,
            price: `${this.totalPrice}`,
            month: `${this.month}`,
            number: `${this.serveCount}`,
            serve_require: this.serve_require
          }, (res) => {
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
          })
        })
      }
    },
    jumpTo () {
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
          'reloadMyCenter',
          'modelHomePage',
          'JumpToMuti'
        ]
        bridge.callHandler('YMDJSBridge_Back', {}, () => {})
        bridge.callHandler('YMDJSBridge_JumpToMuti', {
          page: 'service.html?user_type=2&status=2',
          func: funcArr
        }, () => {})
      })
    },
    endDate (value) {
      this.endvalue = value
    },
    addRequire () {
      let newRequire = { Desc: '', PhotoArr: [] }
      this.serve_require.push(newRequire)
      this.photoShowArr = this.serve_require
      this.$nextTick(() => {
        this.setHeight()
      })
    },
    delRequire (index) {
      if (confirm('删除')) {
        if (this.serve_require.length > 1) {
          this.serve_require.splice(index, 1)
        }
        this.photoShowArr = this.serve_require
      }
    },
    upLoadImg (index) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('YMDJSBridge_Callalbum', {
          count: `${this.photoCount - this.serve_require[index].PhotoArr.length}`
        }, () => {})
        bridge.registerHandler('YMDJSBridge_fetchImg', (data) => {
          if (data.arr_img_url === undefined) {
            let arrUrl = JSON.parse(data).oss_url
            for (let i = 0; i < arrUrl.length; i++) {
              this.serve_require[index].PhotoArr.push(arrUrl[i])
            }
          } else {
            let arrUrl = data.oss_url
            arrUrl = JSON.parse(arrUrl)
            for (let i = 0; i < arrUrl.length; i++) {
              this.serve_require[index].PhotoArr.push(arrUrl[i])
            }
          }
          this.photoShowArr = this.serve_require
        })
      })
    },
    onlyNum (event) {
      if (!(event.keyCode === 46) && !(event.keyCode === 8) &&
        !(event.keyCode === 37) && !(event.keyCode === 39)) {
        if (!((event.keyCode >= 48 && event.keyCode <= 57) ||
          (event.keyCode >= 96 && event.keyCode <= 105))) {
          event.returnValue = false
        }
      }
      if (this.deposit[0] === '0' || this.deposit[0] === '-') {
        this.deposit = ''
      }
    }
  },
  computed: {
    serve_uuid () {
      let arr = []
      for (let v in this.commonData) {
        arr.push(this.commonData[v].serve_uuid)
      }
      return arr
    },
    target_uuid () {
      let arr = []
      for (let v in this.commonData) {
        arr.push(this.commonData[v].user_uuid)
      }
      return arr
    },
    totalPrice () {
      let price = 0
      for (let v in this.commonData) {
        price += +this.commonData[v].price_list.price
      }
      return price * this.serveCount
    },
    nowtime () {
      let today = new Date()
      let setmonth = (today.getMonth() + 1).toString() > 9 ? (today.getMonth() + 1).toString() : '0' + (today.getMonth() + 1).toString()
      let day = today.getDate().toString() > 9 ? today.getDate().toString() : '0' + today.getDate().toString()
      let nowvalue = today.getFullYear().toString() + '-' + setmonth + '-' + day
      return nowvalue
    },
    depositVerify () {
      return /^[0-9]*[1-9][0-9]*$/.test(this.deposit)
    },
    activePay () {
      if (this.endvalue === '请选择' || this.serve_require[0].Desc === '') {
        return false
      }
      return true
    },
    ...mapGetters([
      'commonData',
      'serveName',
      'serveType'
    ])
  },
  components: { headerBar, footerBar, Datetime, Group, swiper, swiperSlide }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../../assets/css/wscss/mixin.scss";
$red: #FFCCDA;
$back: #f4f4f4;
.swiper-container{
  /* margin: inherit !important; */
}
 .creat-order{
   border: 1px solid transparent;
   background: #fff;
   padding: 0 1.5rem 70px 1.5rem;
   font-size: 1.4rem;
   ::-webkit-input-placeholder {
     color: rgba(0,0,0,.5);
     font-size: 1.4rem;
     text-align: left;
   }
   .serve-require{
     .require-wrapper{
       line-height: 0rem;
       textarea{
         height: 11rem;
         resize: none;
         width: 100% !important;
         background: $back;
         padding: 1rem;
         font-size: 1.4rem;
         line-height: 2.5rem;
         color: rgba(0,0,0,.5);
       }
     }
     .add-del{
       text-align: right;
       font-size: 0;
       display: flex;
       align-items: center;
       justify-content: flex-end;
       height: 8.5rem;
       button{
         width: 8rem;
         height: 3.5rem;
         border-radius: 3.5rem;
         color: #fff;
         font-size: 1.2rem;
         margin-left: 2rem;
       }
       .del{
         background: #000;
       }
       .add{
         background: #eb0044;
       }
     }
     .pic-wrapper{
       margin-top: 1.5rem;
       .photo-list {
         width: 100%;
         height: 11.5rem;
         .swiper-item{
           text-align: center;
          font-size: 18px;
          background: #fff;

          /* Center slide text vertically */
          display: -webkit-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          -webkit-justify-content: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
         }
         .bg-img {
           background-position: center !important;
           background-repeat: no-repeat !important;
           background-size: cover !important;
         }
         .input-box{
           span{
             display: inline-block;
           }
           span:nth-of-type(1){
             position: absolute;
             left: 50%;
             top: 30%;
             font-size: 2.5rem;
             line-height: 2.5rem;
             margin-left: -1.25rem;
           }
           span:nth-of-type(2){
             position: absolute;
             width: 100%;
             left: 0;
             top: 55%;
             text-align: center;
             padding: 0 2.2rem;
             font-size: 1.2rem;
             line-height: 1.6rem;
             color: rgba(0,0,0,.5);
           }
           input[type=file] {
             display: inline-block;
             width: 100%;
             height: 100%;
             font-size: 0;
             background: transparent;
             opacity: 0;
             filter: alpha(opacity=0);
             position: absolute;
             left: 0;
             top: 0;
             z-index: 10;
           }
         }
         .pic-desc{
           height: 100%;
           width: 100%;
           background: $back;
           text-align: center;
           position: relative;
         }
       }
     }
   }
   .serve-month{
     .btn{
       float: left;
       width: 7rem;
       border-radius: 3.5rem;
       line-height: 3.5rem;
       border: 1px solid #E7E5E5;
       text-align: center;
       margin-right: 3rem;
       color: rgba(0,0,0,.5);
       &.monthActive{
         background: #eb0044;
         color: #fff;
       }
     }
     @media only screen and (max-width: 320px) {
       .btn{
         width: 6.5rem;
         margin-right: 2rem;
       }
     }
   }
   .count-wrapper{
     vertical-align: top;
     span{
       display:inline-block;
       width: 7rem;
       line-height:3.5rem;
       font-size:2rem;
       text-align:center;
     }
     button {
       display:inline-block;
       width: 7rem;
       line-height:3.5rem;
       border-radius: 3.5rem;
       background: #f4f4f4;
       font-size: 2rem;
       color: #232323;
     }
   }
   .serve-hint{
     font-size: 1.3rem;
     color: rgba(0,0,0,.5);
     @include border-none();
     .hint{
       line-height: 2rem;
     }
   }
   .serve-date{
     .disabled-box{
      width: 12rem !important;
      height: 3.5rem;
      border-radius: 3.5rem;
      background: transparent;
      position: absolute;
      z-index: 1000;
     }
   }
   .serve-date{
   .data-wrapper{
     overflow: hidden;
     padding-bottom: 2.5rem;
     width: 100%;
       .fl{
         margin-right: 2rem;
         line-height: 3.5rem;
       }
     }
   }
   .serve-deposit{
     &>.fl{
       span{
         color: #eb0044;
         font-size: 1rem;
         margin-left: 1rem;
       }
     }
     .btn{
       span{
         color: rgba(0,0,0,.5);
       }
       .oinput{
         color: #000;
       }
       ::-webkit-input-placeholder {
         font-size:1.4rem;
         text-align: right;
          }
         input{
           text-align: right;
           font-size: 1.4rem;
           width: 4rem;
         }
     }
   }
   .serve-amount{
     line-height:1.4rem;
     margin-top: 2.5rem;
     .count{
       line-height: 3rem;
     }
     .price{
       color: #eb0044;
       line-height: 3rem;
       text-align: right;
       margin-bottom: 2rem;
     }
   }
   &>div{
     overflow: hidden;
     @include border-1px(rgba(0,0,0,.1));
     line-height: 6.4rem;
     &>.fl{
       color: rgba(0,0,0,1);
     }
     .btn{
     }
   }
 }
.goPay{
  height: 50px;
  display: flex;
  position: fixed;
  z-index: 9999;
  bottom: 0;
  left: 0;
  background: #fff;
  border-top: 1px solid rgba(0,0,0,.1);
  width: 100%;
  font-size: 1.6rem;
  padding-left: 1.5rem;
  .total{
    flex: 1;
    line-height: 50px;
    &>span{
      color: #eb0044;
      span{
      display: inline-block;
      font-size: 2.4rem;
      height: 30px;
      width: 20px;
      }
    }
  }
  .paybtn{
    flex: 0 0 13rem;
    background: $red;
    color: #fff;
    text-align: center;
    line-height: 50px;
  }
  .active{
    background-color: #eb0044;
  }
}
</style>
