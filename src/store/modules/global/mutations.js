import * as types from './mutations_types'

import {
    store
} from 'utils/';

export default {
    [types.SHOW_LOADING](state) {
        state.ajaxLoading = true;
    },

    [types.HIDE_LOADING](state) {
        state.ajaxLoading = false;
    },

    [types.UPDATE_CURR_TOOLBAR](state,value) {
        state.currToolbarVueId = value;
    },

    [types.UPDATE_PRE_TOOLBAR](state,value) {
        state.preToolbarVueId = value;
    },

    [types.UPDATE_MENU_WIDTH](state,value) {
        state.menuWidth = value;
    },
};