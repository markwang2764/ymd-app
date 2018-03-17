<template lang="html">
<div class="hint" v-text="text">
</div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style lang="scss" scoped>
$pink: #ffccda;
$red: #eb0044;
.hint {
  width: 100vw;
  margin: 0 auto;
  text-align: center;
  height: 5rem;
  background: $red;
  color: #fff;
  line-height: 5rem;
  font-size: 16px;
}
</style>
