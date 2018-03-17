<template lang="html">
<div class="footerBar"
    :class="{'active': activeToGo}"
    @click="routerGo">{{text}}
    <slot name="submit-audit"></slot>
</div>
</template>

<script>

export default {
  props: ['text', 'name', 'activeToGo'],
  methods: {
    routerGo () {
      if (this.name) {
        this.$router.push({ name: this.name })
      }
      return
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
