import Vue from 'vue'
import Vuex from 'vuex'
import pkg from '../../package.json'
import * as actions from './actions'
import * as getters from './getters'

import app from './modules/app'
//import menu from './modules/menu'
import user from './modules/user'
import global from './modules/global'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,  // process.env.NODE_ENV !== 'production',
  actions,
  getters,
  modules: {
    app,
    user,
    global
  },
  state: {
    pkg
  },
  mutations: {
  }
})

export default store
