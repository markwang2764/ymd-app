<template lang="html">
  <div class="popup">
    <slot name="popup-title"></slot>
    <slot name="popup-content"></slot>
    <slot name="popup-largeBtn"></slot>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import "../../../assets/css/wscss/mixin.scss";
  .popup {
    height: 100vh;
    width: 100vw;
    background: rgba(255,255,255,.9);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    .title {
      text-align: center;
    }
    [slot=popup-title] {
      text-align: center;
      @include border-1px(rgba(0,0,0,.1));
      line-height: 5rem;
      font-size: 2.2rem;
      margin: 0 3rem;
      margin-top: 40vh;
    }
    [slot=popup-content] {
      margin-top: 3.1rem;
      text-align: center;
      line-height: 2rem;
      font-size: 1.3rem;
    }
    [slot=popup-largeBtn] {
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
  }
</style>
