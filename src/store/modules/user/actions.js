
import * as types from './mutations_types.js';

export default {
    update_userinfo: ({commit}, {userinfo}) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_USERINFO, {
                userinfo
            });
            resolve()
        });
    },

    remove_userinfo: ({commit}) => {
        return new Promise((resolve, reject) => {
            commit(types.REMOVE_USERINFO);
            resolve()
        });
    },


    update_remenber: ({commit}, {remenber_flag,remenber_login_info}) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_REMENBER, {
                remenber_flag,
                remenber_login_info
            });
            resolve()
        });
    },

    remove_remenber: ({commit}) => {
        return new Promise((resolve, reject) => {
            commit(types.REMOVE_REMENBER);
            resolve()
        });
    },

    update_resp: ({commit}, {respList}) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_RESP, {respList});
            resolve()
        });
    },

    remove_resp: ({commit}) => {
        return new Promise((resolve, reject) => {
            commit(types.REMOVE_RESP);
            resolve()
        });
    },

    update_resp_active: ({commit}, {respActive}) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_RESP_ACTIVE, {respActive});
            resolve()
        });
    },

    remove_resp_active: ({commit}) => {
        return new Promise((resolve, reject) => {
            commit(types.REMOVE_RESP_ACTIVE);
            resolve()
        });
    },
};