import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
//import VueAuth from '@websanova/vue-auth'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import { TOGGLE_SIDEBAR } from '@/store/mutation-types'
import VeeValidate from 'vee-validate'

import Buefy from 'buefy'
//import 'buefy/lib/buefy.css'

import 'register/'

Vue.use(Buefy, {defaultIconPack: 'fa'})
Vue.use(VeeValidate,{events: 'input'})

Vue.router = router
Vue.use(VueAxios, axios)

import fastclick from 'fastclick'
fastclick.attach(document.body)

/*
var VueTouch = require('vue-touch')
VueTouch.registerCustomEvent('doubletap', {
  type: 'tap',
  taps: 2
})
Vue.use(VueTouch, {name: 'v-touch'})
*/

/*
Vue.use(VueAuth, {
  auth: {
    request: function (req, token) {
      this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + token})
    },
    response: function (res) {
      // Get Token from response body
      return res.data
    }
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: 'http://localhost:6789/login', fetchUser: false },
  refreshData: { enabled: false }
})*/

Vue.use(NProgress)

// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((route, redirect, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, {opened:false})
  }
  //document.documentElement.classList['remove']('is-clipped')
  if(route.meta.title){
    document.title = route.meta.title+' | vue-jebms'
  }
  next()
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

app.$mount('#app')
