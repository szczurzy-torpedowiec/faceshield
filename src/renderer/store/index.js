import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autostartConfig: null,
  },
  mutations: {
    setAutostartConfig(state, config) {
      state.autostartConfig = config;
    }
  },
  actions: {
  },
  modules: {
  }
})
