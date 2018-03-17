<template lang="html">
<div class="addMdIndex">
  <header-bar :back-to-web="true" :title="title"></header-bar>
  <div class="audit">
    <a @click="selectName($event, 'user')" class="audit-hook">我来帮麻豆填资料</a>
  </div>
  <footer-bar :active-to-go="active" :text="footText" :jsbriage="'YunBeanLink'"></footer-bar>
</div>
</template>


<script>
import headerBar from '../common/header-bar.vue'
import footerBar from '../common/footer-bar.vue'
export default {
  name: 'addMdIndex',
  data () {
    return {
      title: '添加麻豆',
      footText: '下一步',
      name: null,
      active: false
    }
  },
  methods: {
    selectName (e, name) {
      this.active = true
      e.currentTarget.className = 'audit-hook opt'
    }
  },
  components: { headerBar, footerBar }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../../assets/css/wscss/commonStyle.scss";
</style>
