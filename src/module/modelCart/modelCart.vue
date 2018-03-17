<template>
    <div id="modelCart">
      <transition :name="transitionName">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
</template>

<script>
import {eventHub} from './eventhub.js'
export default {
  name: 'modelCart',
  data () {
    return {
      transitionName: ''
    }
  },
  created () {
    eventHub.$on('backword', () => {
      this.transitionName = 'slide-right'
    })
  },
  watch: {
    '$route' (to, from) {
      if (to.name === undefined) {
        return
      }
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/css/wscss/mixin.scss";
.slide-left-enter-active {
  animation-name: slide-left-in;
  animation-duration: .35s;
}
.slide-left-leave-active {
  animation-name: slide-left-out;
  animation-duration: .35s;
  position:fixed;
}
@keyframes slide-left-in {
  0% {
     transform: translate(100%);
   }
   100% {
     transform: translate(0%);
   }
}
@keyframes slide-left-out {
  0% {
     transform: translate(0);
   }
   100% {
     transform: translate(-100%);
   }
}
.slide-right-enter-active {
  animation-name: slide-right-in;
  animation-duration: .35s;
}
.slide-right-leave-active {
  animation-name: slide-right-out;
  animation-duration: .35s;
  position:fixed;
}
@keyframes slide-right-in {
  0% {
     transform: translate(-100%);
   }
   100% {
     transform: translate(0%);
   }
}
@keyframes slide-right-out {
  0% {
     transform: translate(0%);
   }
   100% {
     transform: translate(100%);
   }
}
#modelCart{
  position: relative;
}
.popup-title {
  text-align: center;
  @include border-1px(rgba(0,0,0,.1));
  line-height: 5rem;
  font-size: 2.2rem;
  margin: 0 3rem;
  margin-top: 40vh;
}
.popup-content {
  margin-top: 3.1rem;
  text-align: center;
  line-height: 2rem;
  font-size: 1.3rem;
}
.popup-largeBtn {
  font-size: 1.3rem;
  text-align: center;
  margin: 0 3rem;
  height: 3rem;
  background: #eb0044;
  border-radius: 3rem;
  margin-top: 3.1rem;
  color: #fff;
  line-height: 3rem;
}
.vux-no-group-title{
   width:12rem !important;
   height: 3.5rem;
   border-radius: 3.5rem;
   border: 1px solid rgba(0, 0, 0, 0.2);
     }
 @media only screen and (max-width: 320px) {
   .vux-no-group-title{
      width:10rem !important;
      height: 3.5rem;
      border-radius: 3.5rem;
      border: 1px solid rgba(0, 0, 0, 0.2);
        }
 }
     .weui_cell_primary{
       display: none;
     }
     .weui_cell_ft.with_arrow:after{
       display: none !important;
     }
     .weui_cells:before{
       display: none;
     }
     .weui_cells{
       margin-top: 0 !important;
     }
     .weui_cell{
       padding: 0 !important;
     }
     .weui_cells:after{
       display: none;
     }
     .weui_cell_ft {
       text-align: center !important;
       width: 100%;
       line-height: 3.5rem;
       font-size: 1.3rem;
       color: rgba(0, 0, 0, 0.5) !important;
     }
     .dp-header .dp-item{
       color: rgba(0, 0, 0, 0.5) !important;
     }
     .content.userlist{
       flex: 1;
       height: 10rem;
       position: relative;
       span,i{
        display: inline-block;
       }
       .headPortrait{
         width: 4rem;
         height: 4rem;
         border-radius: 50%;
         background-size: cover;
         margin-right: 1rem;
         margin-top: 3rem;
       }
       .name{
         position: absolute;
         top: 3rem;
       }
       .mdlv,.realname{
         width: 6.3rem;
         height: 1.6rem;
       }
       .mdlv1{
         background: url('../../assets/img/mdlv_1.svg') no-repeat;
         background-size: 6.3rem 1.6rem;
       }
       .mdlv2{
         background: url('../../assets/img/mdlv_2.svg') no-repeat;
         background-size: 6.3rem 1.6rem;
       }
       .mdlv3{
         background: url('../../assets/img/mdlv_3.svg') no-repeat;
         background-size: 6.3rem 1.6rem;
       }
       .realname {
         width: 5.1rem;
         background: url('../../assets/img/realname_2.svg') no-repeat;
         background-size: 5.1rem 1.6rem;
       }
     }

</style>
