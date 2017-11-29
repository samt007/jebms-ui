import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

// 导入封装的回调函数
import {
    cbs,
    gbs
} from 'config/';

// 动态设置本地和线上接口域名
Vue.axios.defaults.baseURL = gbs.host;

/**
 * 封装axios的通用请求
 * @param  {string}   type      get或post
 * @param  {string}   path       请求的接口URL
 * @param  {object}   data      传的参数，没有则传空对象
 * @param  {Function} fn        回调函数
 * @param  {boolean}   showLoading 是否需要显示加载样式
 * @param  {boolean}   tokenFlag 是否需要携带认证参数，为true，需要；false，不需要。一般除了登录，都需要
 */
export default function ({
     type,
     path,
     data,
     showLoadingFlag,
     tokenFlag,
     headers,
     opts
} = {}) {
    var options = {
        method : type,
        url    : path,
        headers: headers && typeof headers === 'object' ? headers : {}
    };

    let showLoading = showLoadingFlag===undefined ? false : showLoadingFlag
    let RequireToken = tokenFlag===undefined ? false : tokenFlag

    //每次调用api之前，必须要验证token是否有效。
    if(RequireToken===true&&this.$store.state.user.userinfo.token===undefined){
        console.log('api STOP!')
        this.$notify.error({
          content: '登录信息无效，请重新登录！'
        });
        this.$router.push('/login')
        return
    }

    var reg_para = /{([\w\W]*?)}/g,urlPost='';
    if(typeof data=='object'){// 将url里面出现的{}进行处理
        urlPost = path.replace(reg_para,function(result,key){
            var jsonVal=data[key];
            if(jsonVal){
                delete data[key];
                return jsonVal;
            }else{
                return "";
            }
        });
        options.url=urlPost;
    }

    options[type === 'get' ? 'params' : 'data'] = data;

    // 分发加载样式任务
    this.$store.dispatch('show_loading');

    if(showLoading==true){
        var loadingComponent = this.$loading.open();
        //console.log('showLoading!')
    }

    if (RequireToken == true) {
        options.headers.Authorization='Bearer '+this.$store.state.user.userinfo.token;
    }

    // axios内置属性均可写在这里
    if (opts && typeof opts === 'object') {
        for (var f in opts) {
            options[f] = opts[f];
        }
    }

    return new Promise((resolve, reject) => {
        // 发送请求
        Vue.axios(options).then((res) => {
            if(showLoading==true){
                loadingComponent.close();
            }
            if(res[gbs.api_status_key_field]===gbs.api_status_value_field){
                if(gbs.api_data_field){
                    resolve(res[gbs.api_data_field]);
                }else{
                    resolve(res.data);
                }
            }else{
                if(gbs.api_custom[res[gbs.api_status_key_field]]){
                    gbs.api_custom[res[gbs.api_status_key_field]].call(this,res.data);
                }else{
                    if(reject){
                        reject.call(this,res.data);
                    }else{
                        cbs.statusError.call(this, res.data);
                    }
                }
            }
            this.$store.dispatch('hide_loading');
        }).catch((err) => {// 发现只要是非200的，都会跳到这里。
            this.$store.dispatch('hide_loading');
            if(showLoading==true){
                loadingComponent.close();
            }
            if(!err.response){
                throw new Error('请求('+path+')出现异常错误，信息:'+JSON.stringify(err));
            }
            if(reject){
                reject.call(this,err.response.data);
            }else{
                if(gbs.api_custom[err.response[gbs.api_status_key_field]]){
                     gbs.api_custom[err.response[gbs.api_status_key_field]].call(this,err.response.data);
                }else{
                    cbs.requestError.call(this, err);
                }
            }
            if(err.response&&err.response[gbs.api_status_key_field]=='401'){
                this.$store.dispatch('remove_userinfo').then(() => {
                    this.$router.push('/login');
                });
            }
        });
    })
};
