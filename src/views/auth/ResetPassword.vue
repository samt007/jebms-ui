<template>
    <div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">重置密码</p>
            </header>
            <section class="modal-card-body">
              <form @submit.prevent="resetPassword">
                <b-field label="旧密码">
                    <b-input
                        type="password"
                        v-model="oldPassword"
                        password-reveal
                        placeholder="旧密码"
                        ref="oldPassword"
                        required>
                    </b-input>
                </b-field>

                <b-field label="新密码">
                    <b-input
                        type="password"
                        v-model="newPassword"
                        password-reveal
                        placeholder="新密码"
                        ref="newPassword"
                        required
                        @keydown.ctrl.76.prevent="resetPassword">
                    </b-input>
                </b-field>
                <footer class="modal-card-foot">
                    <button class="button" type="button" @click="$parent.close()">Close</button>
                    <button class="button is-primary">确认重置密码</button>
                </footer>
             </form>
          </section>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['userId'],
        data(){
          return{
            oldPassword:null,
            newPassword:null
          }
        },
        methods:{
          resetPassword(){
            /*console.log("userId:"+this.userId)
            console.log("oldPassword:"+this.oldPassword)
            console.log("newPassword:"+this.newPassword)*/
            if(!this.userId){
              this.$notify.info({content: "所更新密码的用户为空！"})
              return
            }
            this.$ajaxPostData({
              path:'/fnd/user/password/'+this.userId,
              data:{'oldPassword':this.oldPassword,'newPassword':this.newPassword},
              showLoadingFlag:'Y'
            }).then(()=>{
              //this.$toast.open(`您已经更新密码！`)
              this.$notify.info({content: "您已经更新密码！"})
              this.$parent.close()
            }).catch((err)=>{
              console.log(err)
              this.$notify.error({content: "更新密码出现异常："+err})
            })
          }
        },
        mounted(){
          this.$nextTick(()=>{
            this.$refs.oldPassword.focus()
            /*setTimeout(() => {
              this.oldPassword=''
            }, 400);*/
          })
        }
    }
</script>

<style scoped>
    .modal-card {
        width: auto;
    }
</style>