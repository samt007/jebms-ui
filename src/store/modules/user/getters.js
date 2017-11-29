
export default {
    getUserinfo(state) {
        return state.userinfo;
    },

    getToken(state) {
        return state.userinfo && state.userinfo.token ? state.userinfo.token : '';
    },

    getRemenber(state){
        return state.remenber;
    },

    getRespList(state){
        return state.respList;
    },

    getRespActive(state){
        return state.respActive;
    },
};