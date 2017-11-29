
import Vue from 'vue';
import _ from 'underscore';
import {string} from 'utils/';
import libs from './lib.js';
import cps from './component.js';
import mixins from './mixin';
import plugins from './plugin';

/**
 * 把一些全局对象和一些全局方法，注册到Vue原型上
 */
Vue.use({
    install(Vue, options) {
        Vue.mixin(mixins);

        //注册第三方库
        _.each(libs, (item, key) => {
            Vue.prototype['$' + key] = item;
            //console.log('注册第三方库:$'+key);
        });

        //注册全局方法，如常用的接口方法，工具方法等。
        _.each(plugins, (item, key) => {
            Vue.prototype['$' + key] = item;
            //console.log('注册全局方法:$'+key);
        });
    }
});

import '../components/_all.scss';//引入组件的css文件

_.each(cps, (item, key) => {
    var cp_name=key.replace(/([A-Z])/g,"-$1").toLowerCase();
    if(cp_name && cp_name[0]==='-'){
        cp_name=cp_name.replace('-','');
    }
    Vue.component(cp_name, item);
    //console.log('注册组件:'+cp_name);
});

//注册自定义指令：https://cn.vuejs.org/v2/guide/custom-directive.html#
Vue.directive('focus', {
  inserted: function (el, binding,vnode) {    //在元素每次更新时调用。
    //console.log('inserted')
    // 聚焦元素
    if(binding.value===undefined?true:binding.value){
        if(el.nodeName=='INPUT' || el.nodeName=='SELECT' || el.nodeName=='TEXTAREA'){
            el.focus()
        }else{
            if (el.getElementsByTagName('input').length) {
                el.getElementsByTagName('input')[0].focus();
            }else if(el.getElementsByTagName('select').length) {
                el.getElementsByTagName('select')[0].focus();
            }else if(el.getElementsByTagName('textarea').length) {
                el.getElementsByTagName('textarea')[0].focus();
            }
        }
    }
   },
  update: function (el, binding,vnode,oldVnode) {    //在元素每次更新时调用。
    //console.log('update')
    //console.log('oldVnode:%o\n'+oldVnode.elm.outerHTML+'\nnewVnode:%o\n'+vnode.elm.outerHTML,oldVnode,vnode)
    if(binding.value===undefined?true:binding.value){
        let focusDom
        if(el.nodeName=='INPUT' || el.nodeName=='SELECT' || el.nodeName=='TEXTAREA'){
            focusDom=el
        }else{
            if (el.getElementsByTagName('input').length) {
                focusDom=el.getElementsByTagName('input')[0]
            }else if(el.getElementsByTagName('select').length) {
                focusDom=el.getElementsByTagName('select')[0]
            }else if(el.getElementsByTagName('textarea').length) {
                el.getElementsByTagName('textarea')[0].focus();
            }else{
                throw new Error('该标签不支持自动聚焦！')
            }
        }
        //console.log(document.activeElement)
        //console.log(focusDom)
        if((document.activeElement.nodeName=='INPUT'
            ||document.activeElement.nodeName=='SELECT'
            ||document.activeElement.nodeName=='TEXTAREA')
            &&document.activeElement!==focusDom) return
        //备注：为了聚焦的功能，几乎花费一整天的时间。结论在这里：Vuejs学习总结。
        if(document.activeElement===focusDom) return
        focusDom.focus()
        //console.log('do focus!')
    }
   },
});

/*
directives: {
    focus: {
        inserted: function (el, {value}) {  //在元素渲染到dom时调用，只调用一次。
            console.log('inserted')
            if (el.getElementsByTagName('input').length) {
                el.getElementsByTagName('input')[0].focus();
            }
        },
        update: function (el,{value}) {    //在元素每次更新时调用。
           // 聚焦元素
           //el.focus()
           //el.select()
           console.log('update')
           if (el.getElementsByTagName('input').length) {
                el.getElementsByTagName('input')[0].focus();
           }
        }
    }
},
*/