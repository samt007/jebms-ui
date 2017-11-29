
import {
    store
} from 'utils/';

//console.log(JSON.stringify(store.get('userinfo')));

export default {

    //登录成功后的用户信息
    userinfo: store.get('userinfo') || {},

    //登录成功后的用户职责列表
    respList: store.get('resp_list') ||  [],

    //登录成功后的用户当前使用的职责
    respActive: store.get('resp_active') ||  {},

    //记住密码相关信息，现在暂且只做记住一个账号密码
    //后期：每次登录成功一次，就缓存到列表中，然后在登录表单，输入时，会出现下拉列表选择之前登录过得用户
    remenber: {
        remenber_flag: store.get('remenber_flag') ? true : false,
        remenber_login_info: store.get('remenber_login_info') || {
            userName: '',
            token: ''
        }
    },
};