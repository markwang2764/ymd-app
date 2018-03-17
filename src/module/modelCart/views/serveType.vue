<template lang="html">
<div class="addMdIndex">
  <header-bar :back-to-web="true" :title="title"></header-bar>
  <div class="service-content" v-if = "cartServe">
    <div v-if="commonType === 'Common'">
          <div class="clearfix service-list" v-for="item in cartServe">
            <div class="service-name" v-if = "item.serve_type === '1' && item.serve_list.length">
              拍摄服务
            </div>
            <div class="service-name" v-if = "item.serve_type === '8' && item.serve_list.length">
              转发服务
            </div>
            <div class="service-name" v-if = "item.serve_type === '7' && item.serve_list.length">
              直播服务
            </div>
              <div class="gray-box list-hook" v-for = "v in item.serve_list" @click="selectMenu($event, v.serve_user_uuid, v.serve_name, item.serve_type)">
                <div class="stance" v-if="v.serve_user_uuid.length !== 1">
                </div>
                <i class="icon" :style="{backgroundImage: 'url(' + v.unselect_icon + ')'}"></i>
                <i class="iconActive" :style="{backgroundImage: 'url(' + v.select_icon + ')'}"></i>
                <div class="name">{{v.serve_name}}</div>
                <div class="price" v-if="v.serve_user_uuid.length === 1">
                  {{v.serve_user_uuid[0].price_list.price_show}}
                </div>
              </div>
          </div>
    </div>
    <div class="noCommon" v-else-if="commonType === 'noCommon'">
      还没有共性的服务哦 !
    </div>
  </div>
  <div class="goPay" @click="goToPayment" :class="{red: active}">
    确认
  </div>
</div>
</template>


<script>
import headerBar from '../common/header-bar.vue'
import footerBar from '../common/footer-bar.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'serveType',
  data () {
    return {
      title: '服务类型',
      footText: '确认',
      name: null,
      active: false,
      cartId: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.cartId = vm.$route.params.id
    })
  },
  methods: {
    selectMenu (e, serveUuid, serveName, serveType) {
      this.active = true
      const selectedEls = document.getElementsByClassName('list-hook')
      for (let i = 0; i < selectedEls.length; i++) {
        let item = selectedEls[i]
        item.className = 'gray-box list-hook'
      }
      e.currentTarget.className = 'gray-box list-hook list-hook-active'
      this.$store.dispatch('setCommonData', {
        serveUuid: serveUuid,
        serveName: serveName,
        serveType: serveType
      })
    },
    goToPayment () {
      if (this.active) {
        this.$router.push({ name: 'payMent' })
      }
    }
  },
  computed: {
    commonType () {
      for (let i in this.cartServe) {
        if (this.cartServe[i].serve_list.length) {
          return 'Common'
        }
      }
      return 'noCommon'
    },
    ...mapGetters([
      'cartServe',
      'cartCode',
      'commonData'
    ])
  },
  components: { headerBar, footerBar }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$background: #f0f0f0;
$red: #eb0044;
.noCommon {
  text-align: center;
  font-size: 2rem;
  margin-top: 5rem;
}
.addMdIndex {
  width: 100vw;
  height: 100vh;
  background: #fff;
  position: relative;
  .goPay{
    height: 7vh;
    position: fixed;
    width: 100vw;
    top: 93vh;
    background: #ffccda;
    line-height: 7vh;
    font-size: 1.6rem;
    text-align: center;
    color: #fff;
    &.red {
      background: #Eb0044;
    }
  }
  @media only screen and (max-width: 320px) {
    .goPay {
      top: 91.5vh;
      height: 8.5vh;
      line-height: 8.5vh;
    }
  }
}
.service-content{
  border: 1px solid transparent;
  background: #fff;
  padding: 0 1.5rem 50px 1.5rem;
  .service-list{
    width: 100%;
    .service-name {
      line-height: 5rem;
      font-size: 1.4rem;
    }
    .list-hook-active{
      background: $red !important;
      width: 48%;
      float: left;
      margin: 2rem 0 2.5rem 0;
      .name{
        color: #fff;
      }
      .icon{
        display: none !important;
      }
      .iconActive{
        display: inline-block !important;
        width: 3rem;
        height: 3rem;
        margin: 3rem auto .5rem auto;
        background-size:3rem auto;
        background-position: center center;
      }
      .price, .fans{
        color: #fff !important;
      }
    }

      .gray-box{
        &:nth-of-type(even){
          margin-right: 4%;
        }
        width: 48%;
        float: left;
        height: 15rem;
        margin: 0 0 2.5rem 0;
        background: $background;
        text-align: center;
        font-size: 0;
        .empty{
          height: 2rem;
        }
        .name{
          font-size: 1.2rem;
          line-height: 2.5rem;
          margin-bottom: .5rem;
        }
        .stance {
          height: 1rem;
        }
        .price {
          color: #eb0044;
          font-size: 1.2rem;
          line-height: 2rem;
          padding-bottom: 3rem;
        }
        .fans{
          font-size: 1.2rem;
          height: 3rem;
        /*   line-height: rem; */
        }
        .icon{
          display: inline-block;
          width: 3rem;
          height: 3rem;
          margin: 3rem auto .5rem auto;
          background-size:3rem auto;
          background-position: center center;
        }
        .iconActive{
          display: none;
        }
      }
@media only screen and (max-width: 320px) {
  .gray-box{
    height: 13rem;
    &:nth-of-type(even){
      margin-right: 4%;
    }
    width: 48%;
    float: left;
    margin: 0 0 2.5rem 0;
    background: $background;
    text-align: center;
    font-size: 0;
    .empty{
      height: 2rem;
    }
    .name{
      font-size: 1.2rem;
      line-height: 2.5rem;
      margin-bottom: .1rem;
    }
    .price {
      color: #eb0044;
      font-size: 1.2rem;
      line-height: 2rem;
      padding-bottom: 2rem;
    }
    .fans{
      font-size: 1.2rem;
      height: 2rem;
      line-height: rem;
    }
    .icon{
      display: inline-block;
      width: 3rem;
      height: 3rem;
      margin: 2rem auto .5rem auto;
      background-size:3rem auto;
      background-position: center center;
    }
    .iconActive{
      display: none;
    }
  }
}
  }
}
.confirm{
  height: 50px;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 50px;
  background: #FCD1DE;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  a{
    width: 100%;
    height: 100%;
    display: inline-block;
    color: #fff;
  }
  &.active{
    background: $red !important;
  }
}
</style>
