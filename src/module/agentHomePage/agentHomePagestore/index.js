import Vue from 'vue'
import Vuex from 'vuex'
import AgentHomePage from './modules/agentHomePageStore.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AgentHomePage
  }
})
