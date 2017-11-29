
import {
    store
} from 'utils/';


import * as types from './mutations_types'


export default {
    [types.UPDATE_USERINFO](state, user_db) {
        state.userinfo = user_db.userinfo || {};
        store.set('userinfo', state.userinfo);
    },

    [types.REMOVE_USERINFO](state) {
        store.remove('userinfo');
        state.userinfo = {};
    },

    [types.UPDATE_REMENBER](state, user_db) {
        state.remenber.remenber_flag = user_db.remenber_flag;
        state.remenber.remenber_login_info = user_db.remenber_login_info;

        store.set('remenber_flag', state.remenber.remenber_flag);
        store.set('remenber_login_info', state.remenber.remenber_login_info);
    },


    [types.REMOVE_REMENBER](state) {
        store.remove('remenber_flag');
        store.remove('remenber_login_info');

        state.remenber.remenber_flag = false;
        state.remenber.remenber_login_info = {
            username: '',
            token: ''
        };
    },

    [types.UPDATE_RESP](state, resp_db) {
        state.respList = resp_db.respList||[];
        store.set('resp_list', state.respList);
    },


    [types.REMOVE_RESP](state) {
        store.remove('resp_list');
        state.respList = [];
    },

    [types.UPDATE_RESP_ACTIVE](state, resp_active) {
        state.respActive = resp_active.respActive||{};
        store.set('resp_active', state.respActive);
    },

    [types.REMOVE_RESP_ACTIVE](state) {
        store.remove('resp_active');
        state.respActive = {};
    },
};