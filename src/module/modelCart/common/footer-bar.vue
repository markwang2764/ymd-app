<template lang="html">
<div class="footerBar"
    :style="{backgroundColor: bgcolor}"
    v-text="text"
    @touchstart="routerGo">
</div>
</template>

<script>
import { setupWebViewJavascriptBridge } from '../../../assets/js/common'
export default {
  props: ['bgcolor', 'text', 'name', 'activeToGo', 'jsbriage'],
  methods: {
    routerGo () {
      if (this.activeToGo || this.bgcolor) {
        if (!this.jsbriage) {
          this.$router.push({ name: this.name })
        } else {
          setupWebViewJavascriptBridge((bridge) => {
            bridge.callHandler(`YMDJSBridge_${this.jsbriage}`, {
              type: '15',
              user_type: '1'
            }, () => {})
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$pink: #ffccda;
$red: #eb0044;
  .footerBar {
    position: fixed;
    top: 93vh;
    left: 0;
    width: 100%;
    text-align: center;
    height: 7vh;
    background: $pink;
    color: #fff;
    line-height: 7vh;
    font-size: 16px;
    z-index: 9999;
    vertical-align: bottom;
  }
  .active{
    background: $red;
  }
  @media only screen and (max-width: 320px) {
    .footerBar {
      top: 91.5vh;
      height: 8.5vh;
      line-height: 8.5vh;
    }
  }
</style>
