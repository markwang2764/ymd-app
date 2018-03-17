<template lang="html">
  <div class="popup">
    <slot name="popup-title"></slot>
    <slot name="popup-content"></slot>
    <div class="btn-wrapper">
      <slot name="popup-largeBtn"></slot>
    </div>
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
    background: rgba(255,255,255,.95);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    .title {
      text-align: center;
    }
    .btn-wrapper{
    display: flex;
    }
  }
</style>
