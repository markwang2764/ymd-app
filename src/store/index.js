import Vue from 'vue'
import Vuex from 'vuex'
import agent from './modules/agent.js'
import modelCart from './modules/modelCart.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    agent,
    modelCart
  }
})
