
import {ajax} from 'utils/';
import axios from 'axios';
import Notify from '../components/notify';
import MessageModal from '../components/message-modal';
import moment from 'moment';

var plugins={};

/*
for (var i = 0; i < request.length; i++) {
    if (typeof request[i]==='object' && request[i].list && Array.isArray(request[i].list)) {
        console.log('-----');
        console.log(JSON.stringify(request[i]))
        for(var j=0;j<request[i].list.length;j++){
            console.log('api_'+request[i].module+'_'+request[i].list[j].method);
            plugins['api_'+request[i].module+'_'+request[i].list[j].method]=(function(n,m){
                return function({type=request[n].list[m].type,path=request[n].list[m].path,data,fn,errFn,headers,opts}={}){
                    //request[n].list[m].type, request[n].list[m].path, data, fn, opts
                    ajax.call(this,{
                        type,
                        path,
                        data,
                        fn,
                        errFn,
                        headers,
                        opts
                    });
                };
            })(i,j);
        }
    }
}*/

plugins['ajax']=function({type,path,data,showLoadingFlag,tokenFlag,headers,opts}={}){
    return ajax.call(this,{type,path,data,showLoadingFlag,tokenFlag,headers,opts});
}

plugins['ajaxPost']=function({path,data,headers,opts}={}){
    return ajax.call(this,{type:'post',path,data,showLoadingFlag:true,tokenFlag:true,headers,opts});
}

//封装有考虑ajax返回结果code的功能
plugins['ajaxPostData']=function({path,data,showLoadingFlag}={}){
    return new Promise((resolve, reject)=>{
        ajax.call(this,{
            type:'post'
            ,path:path
            ,data:data
            ,showLoadingFlag:showLoadingFlag
            ,tokenFlag:true
        }).then(data=>{
            if(data.code==0){
              resolve(data.obj)
            }else{
              Notify.error({content:'ajaxPostData API('+path+')处理失败！错误信息:'+data.message})
            }
        }).catch(err=>{
            reject(err)
        })
    })
}

plugins['ajaxGet']=function(path,data,headers,opts){
    return ajax.call(this,{type:'get',path,data,showLoadingFlag:true,tokenFlag:true,headers,opts});
}

/*
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios;
Vue.prototype.$notify = Notify;
Vue.prototype.$modal = MessageModal;
*/

axios.defaults.withCredentials = true

plugins['axios'] = axios;
plugins['notify'] = Notify;
plugins['msgmodal'] = MessageModal;
plugins['moment'] = moment;

// console.log(plugins);

export default plugins;