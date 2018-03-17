<template>
    <div id="agent">
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
  name: 'agent',
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
  position:absolute;
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
  position:absolute;
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
#agent{
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
</style>
