import * as types from '../mutation-types'

const state = {
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  }
}

const mutations = {
  [types.TOGGLE_DEVICE] (state, device) {
    state.device.isMobile = device === 'mobile'
    state.device.isTablet = device === 'tablet'
  },

  [types.TOGGLE_SIDEBAR] (state, config) {
    // console.log(config)
    /*
    if (state.device.isMobile && config.hasOwnProperty('opened')) {
      state.sidebar.opened = config.opened
    } else {
      state.sidebar.opened = true
    }*/

    if(state.device.isMobile){// 手机样式
      if (config.hasOwnProperty('opened')){
        state.sidebar.opened = config.opened
        if(state.sidebar.hidden) state.sidebar.hidden=false
      } 
      if (config.hasOwnProperty('hidden')) state.sidebar.hidden = config.hidden
    }else{// 非手机样式：用户可以主动隐藏
      if (config.hasOwnProperty('opened')) {
        state.sidebar.opened = config.opened
        state.sidebar.hidden = !config.opened
      }
      if (config.hasOwnProperty('hidden')) state.sidebar.hidden = config.hidden
    }
  },

  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  }
}

export default {
  state,
  mutations
}
