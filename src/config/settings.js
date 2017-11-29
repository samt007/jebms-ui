var env = process.env;

var gbs={
    // host: '//slsadmin.api.' + (env.NODE_ENV === 'development' ? 'sls' : 'sailengsi') + '.com',
    host: '/jebms', //接口根地址。本地代理到http://192.168.88.123:8080/jEBMS,线上使用的是Nginx代理
    db_prefix: 'jebms_ui_', //本地存储的key

    //状态码字段
    api_status_key_field:'status',

    //状态码value。注意，这里返回的是第一次层的信息。就是网络状态！
    api_status_value_field:200,

    api_data_field:'data',

    api_custom:{
        401:function (res) {
            if(this.$store.state.user.userinfo.token){
                this.$notify.error({
                  content: '登录错误或者未授权！<br/>信息：'+res.status + ',' + res.error +'<br/>path:'+res.path
                });
            }else{
                console.error('The api token is null!')
            }
        },
        404:function (res) {
            this.$notify.error({
              content: '资源未找到！<br/>信息：'+res.status + ',' + res.error +'<br/>path:'+res.path
            });
        },
    },
};

var cbs={
    /**
     * ajax请求成功，返回的状态码不是200时调用
     * @param  {object} err 返回的对象，包含错误码和错误信息
     */
    statusError(err) {
        console.log('statusError:'+JSON.stringfy(err));
        if (err.status == 401||err.status == 404) {
            gbs.api_custom[err.status];
        } else {
            this.$notify.error({
                  content: '返回错误！<br/>信息：'+err.status + ',' + err.error + ',' + err.message
            });
        }
    },

    /**
     * ajax请求网络出错时调用
     */
    requestError(err) {
        this.$notify.error({
            content: '请求出现异常错误：' + (err.response ? err.response.status : '') + ',' + (err.response ? err.response.statusText : '')
        });
    }
};

export {
    gbs,
    cbs
};