<template>
<section class="hero is-info is-fullheight">
  <!-- Hero head: will stick at the top -->
  <div class="hero-head">
  </div>

  <!-- Hero content: will be in the middle -->
  <div class="hero-body">
    <div class="container has-text-centered">
      <h1 class="title">
        Vue jebms System
      </h1>
      <h2 class="subtitle">
        Login
      </h2>
      <div class="columns is-vcentered">
        <div class="column is-4 is-offset-4">
          <div class="box">
            <form @submit.prevent="login">
              <b-field label="">
                  <b-input
                      type="text"
                      v-model="credentials.username"
                      placeholder="Your username"
                      icon="user"
                      required>
                  </b-input>
              </b-field>
              <b-field label="">
                  <b-input
                      type="password"
                      v-model="credentials.password"
                      password-reveal
                      placeholder="Your password"
                      icon="unlock-alt"
                      required>
                  </b-input>
              </b-field>
              <b-field style="text-align: left !important;">
                <b-checkbox v-model='remenber.remenber_flag' :checked='remenber.remenber_flag'>
                  Remember me
                </b-checkbox>
              </b-field>

              <hr>
              <div class="field is-grouped is-grouped-right">
                  <p class="control">
                    <button class="button" type="button" @click="clean">Clean</button>
                  </p>
                  <p class="control">
                    <button type="submit"  class="button is-primary">Login</button>
                  </p>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Hero footer: will stick at the bottom -->
  <div class="hero-foot">
    <nav class="tabs is-boxed is-fullwidth">
      <div class="container">
        <ul>
          <li><a>Overview</a></li>
          <li><a>Modifiers</a></li>
          <li><a>Grid</a></li>
          <li><a>Elements</a></li>
          <li><a>Components</a></li>
          <li><a>Layout</a></li>
        </ul>
      </div>
    </nav>
  </div>
</section>
</template>

<script>
  export default {
    name: 'Login',
    data: function () {
      return {
        credentials: {
          username: '',
          password: '',
          language: 'ZHS'
        },
        remenber:this.$store.state.user.remenber
      }
    },
    methods: {
       async login () {
          var store = this.$store
          var router = this.$router

          var credentials = {
            username: this.credentials.username,
            password: this.credentials.password,
            language: this.credentials.language
          }

          //console.log(credentials)

          if(!(credentials.username&&credentials.password)){
            this.$notify.error({content: '用户名或者密码不允许为空！'})
            return
          }

          let authData={}

          await this.$ajax({
              type:'post',
              path:'/fnd/auth/token',
              showLoadingFlag:true,
              tokenFlag:false,
              data:credentials
          }).then(data=>{
              authData=data
          }).catch(err=>{
                //this.error=JSON.stringify(err);
                this.$notify.error({content: '登录失败，错误信息:'+err.message});
          });

          //console.log(JSON.stringify(data));
          //登录成功之后，验证是否记住密码，如果记住密码，本地保存记住信息
          //如果没有记住，就初始化本地记住信息
          if (this.remenber.remenber_flag === true) {
              this.$store.dispatch('update_remenber', {
                  remenber_flag : this.remenber.remenber_flag,
                  remenber_login_info: {
                      username: authData.authUser.username,
                      token   : authData.access_token
                  }
              });
          } else {
              this.$store.dispatch('remove_remenber');
          }
          authData.authUser.token=authData.access_token

          await this.$store.dispatch('update_userinfo', {userinfo: authData.authUser}).then(() => {});
          //接着要做的事情就是找用户的职责列表
          let userResp={}
          await this.$ajax({
              type:'post',
              path:'/fnd/resp/user',
              showLoadingFlag:true,
              tokenFlag:true,
              data:null
          }).then(data=>{
            userResp=data
          }).catch(err=>{
            this.$notify.error({content: '登录处理异常，错误信息:'+err.message});
          })

          if(userResp.code==0){
              this.$store.dispatch('update_resp', {respList:userResp.obj}).then(()=>{
                this.$store.dispatch('update_resp_active', {respActive:userResp.obj[0]}).then(()=>{
                   this.$router.push('/app/fnd/dashboard') //dashboard
                   setTimeout(()=>{
                      this.$notify.success({content: this.$store.state.user.userinfo.username+' 登录成功！'})
                   },200)
                })
              })
          }else{
              this.$notify.error({content: '登录处理失败！错误信息:'+userResp.message});
              this.$router.push('/login');
          }
       },
       clean(){
          this.credentials.username='';
          this.credentials.password='';
       }
    },
    mounted () {
      if(this.remenber&&this.remenber.remenber_flag==true&&this.remenber.remenber_login_info){
        this.credentials.username=this.remenber.remenber_login_info.username;
      }
    }
  }
</script>

<style lang="scss">
.login {
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    background-color: #3273dc;
    color: #fff;
}
</style>
