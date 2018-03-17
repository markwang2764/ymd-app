<template lang="html">
<div class="agentIndex">
  <header-bar :back-to-app="true" :title="title"></header-bar>
  <div class="audit">
    <a @click="selectName($event, 'user')" class="audit-hook">经纪个人认证</a>
  </div>
  <div class="audit">
    <a @click="selectName($event, 'company')" class="audit-hook">经纪公司认证</a>
  </div>
  <footer-bar :active-to-go="active" :text="footText" :name="name"></footer-bar>
</div>
</template>


<script>
import headerBar from '../common/header-bar.vue'
import footerBar from '../common/footer-bar.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'hello',
  data () {
    return {
      title: '经纪认证',
      footText: '下一步',
      name: null,
      active: false,
      token: ''
    }
  },
  created () {
  },
  mounted () {
    this.$store.dispatch('fetchAgentType')
  },
  methods: {
    selectName (e, name) {
      this.name = name
      this.active = true
      const auditList = document.getElementsByClassName('audit-hook')
      for (let i = 0; i < auditList.length; i++) {
        let item = auditList[i]
        item.className = 'audit-hook'
      }
      e.currentTarget.className = 'audit-hook opt'
    }
  },
  computed: {
    ...mapGetters([
      'userType',
      'companyType'
    ])
  },
  components: { headerBar, footerBar }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../../assets/css/wscss/commonStyle.scss";
</style>
