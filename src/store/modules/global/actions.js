import * as types from './mutations_types';

export default {
    show_loading: ({
        commit
    }) => {
        return new Promise((resolve, reject) => {
            //console.log('actions SHOW_LOADING');
            commit(types.SHOW_LOADING);
            resolve()
        });
    },

    hide_loading: ({
        commit
    }) => {
        return new Promise((resolve, reject) => {
            commit(types.HIDE_LOADING);
            resolve()
        });
    },

    update_curr_toolbar: ({commit},value) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_CURR_TOOLBAR,value);
            resolve()
        });
    },

    update_pre_toolbar: ({commit},value) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_PRE_TOOLBAR,value);
            resolve()
        });
    },

    update_menu_width: ({commit},value) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_MENU_WIDTH,value);
            resolve()
        });
    },
};