<template>
  <section class="is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
      <nav class="navbar is-transparent is-primary">
        <div class="navbar-brand">
          <a class="navbar-item" @click="toggleSidebar({opened: !sidebar.opened})">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </a>
          <a class="navbar-item" href="#">
            <div id="jebms-logo" data-anim-loop="true" style="width:112px;height:28px"></div>
          </a>

          <!--<a class="navbar-item is-hidden-desktop" href="https://github.com/jgthms/bulma" target="_blank">-->
            <!--<span class="icon" style="color: #333;">-->
              <!--<i class="fa fa-lg fa-github"></i>-->
            <!--</span>-->
          <!--</a>-->
          <a class="navbar-item is-hidden-desktop" @click.prevent="$refs.respLov.onOpenLov()">
            <span class="icon">
              <i class="fa fa-lg fa-exchange"></i>
            </span>
          </a>

          <div class="navbar-burger burger"
            :class="{'is-active':activeMenu}"
            @click="toggleMenu">       
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbar-menu-main" class="navbar-menu" :class="{'is-active':activeMenu}"
          :style="activeMenu ? 'overflow-y: scroll;max-height: 480px;' : 'overflow-y: inherit;max-height: inherit;'">
          <div class="navbar-start">

            <div class="navbar-item has-dropdown is-hoverable">
              <div class="navbar-link">
                功能文档
              </div>
              <div id="moreDropdown" class="navbar-dropdown is-boxed">

                <a class="navbar-item "  href="https://github.com/samt007/jebms-ui" target="_blank" >
                  <p>
                    <strong>Jebms overview</strong>
                    <br>
                    <small>versions:1.0.0</small>
                  </p>
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item "  href="https://samt007.github.io/jebms-ui/documentation/" target="_blank" >
                  <p>
                    <strong>Jebms documentation</strong>
                    <br>
                    <small> 开发文档(待完善) </small>
                  </p>
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item " href="https://bulma.io/" target="_blank" >
                  <p>
                    <strong>Bulma UI</strong>
                    <br>
                    <small>Bulma css</small>
                  </p>
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item " href="https://buefy.github.io/" target="_blank" >
                  <p>
                    <strong>Buefy UI</strong>
                    <br>
                    <small>Lightweight UI components for Vue.js</small>
                  </p>
                </a>
              </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
              <div class="navbar-link">
                More
              </div>
              <div id="moreDropdown" class="navbar-dropdown is-boxed">
                <a class="navbar-item " href="https://bulma.io/bulma-start/" target="_blank" >
                  <p>
                    <strong>Bulma start</strong>
                    <br>
                    <small>A tiny npm package to get started</small>
                  </p>
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item " href="https://bulma.io/made-with-bulma/" target="_blank" >
                  <p>
                    <strong>Made with Bulma</strong>
                    <br>
                    <small>The official community badge</small>
                  </p>
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item " href="https://bulma.io/extensions/" target="_blank" >
                  <p>
                    <strong>Extensions</strong>
                    <br>
                    <small>Side projects to enhance Bulma</small>
                  </p>
                </a>
              </div>
            </div>
          </div>

          <div class="navbar-end">
            <!--<a class="navbar-item is-hidden-desktop-only" href="https://github.com/jgthms/bulma" target="_blank">-->
              <!--<span class="icon" style="color: #333;">-->
                <!--<i class="fa fa-lg fa-github"></i>-->
              <!--</span>-->
            <!--</a>-->
            <b-tooltip label="更改密码" type="is-success" position="is-bottom" class="navbar-end">
              <a class="navbar-item" @click.prevent="resetPassword">
                <span class="icon" style="color: #333;">
                  <i class="fa fa-lg fa-key"></i>
                </span>
              </a>
            </b-tooltip>
            <b-tooltip label="点我切换职责" type="is-success" position="is-bottom">
              <e-lov-input class="navbar-end"
                lovTagType="other"
                lovTitle="切换职责"
                lovPath="/fnd/lov/getPageUserResp"
                :lovColumns="respLovColumns"
                :lovSearchInfo="respSearchInfo"
                @lovReturn="changeResp"
                autoQuery suffix-flag ref="respLov">
                <a class="navbar-item" @click.prevent="$refs.respLov.onOpenLov()">
                  <span class="icon" style="color: #333;">
                    <i class="fa fa-lg fa-exchange"></i>
                  </span>
                </a>
              </e-lov-input>
            </b-tooltip>
            <b-tooltip label="退出登录" type="is-danger" position="is-bottom" class="navbar-end">
              <a class="navbar-item" @click.prevent="logout">
                <span class="icon" style="color: #333;">
                  <i class="fa fa-lg fa-sign-out"></i>
                </span>
              </a>
            </b-tooltip>
          </div>
        </div>
        <b-modal :active.sync="isResetPassModalActive" has-modal-card style="z-index: 50;" ref="resetPassword">
          <reset-password v-bind="resetPasswordProps"></reset-password>
        </b-modal>
      </nav>
  </section>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
var Bodymovin = require('bodymovin')
import ResetPassword from '@/views/auth/ResetPassword.vue'

export default {

  name: 'Navbar',

  components: {
      ResetPassword
  },

  props: {
    show: Boolean
  },

  data() {
    return{
      userinfo: this.$store.state.user.userinfo,
      respLovColumns: [
          { title: 'id', field: 'id', visible: false },
          { title: '职责名称', field: 'respName', visible: true, query: true },
          { title: '描述', field: 'description', visible: true, query: true },
          { title: '职责代码', field: 'respCode', visible: false },
          { title: '职责主菜单', field: 'menuName', visible: true },
      ],
      respSearchInfo:{
        pageSize:10,
        userId:this.$store.state.user.userinfo.id
      },
      activeMenu:false,
      isResetPassModalActive: false,
      resetPasswordProps: {
          userId:null
      }
    }
  },

  computed: mapGetters({
    pkginfo: 'pkg',
    sidebar: 'sidebar',
    device: 'device'
  }),

  watch:{
  },

  methods: {
      ...mapActions([
        'toggleSidebar'
      ]),
      logout () {
        this.$dialog.confirm({
          title: '退出登录',
          message: '确认要退出登录？',
          confirmText: '确认',
          type: 'is-warning',
          hasIcon: true,
          onConfirm: () =>{
              this.$ajax({
                  type:'delete',
                  path:'/fnd/auth/token',
                  data:null,
                  showLoadingFlag:true,
                  tokenFlag:true
              }).then(data=>{
                    this.$store.dispatch('remove_userinfo').then(() => {
                        this.$store.dispatch('remove_resp').then(()=>{
                          this.$router.push('/login')
                          this.$toast.open('提示：您已经退出登录！')
                          //console.log(JSON.stringify(this.$store.state.user.respList));
                        })
                    });
                }
              ).catch(err=>{
                    this.error=JSON.stringify(err);
              });
          }
        });
      },
      changeResp(lovSelected){
        this.$ajaxPostData({
          path:'/fnd/resp/get/'+lovSelected.id,
          data:null,
          showLoadingFlag:true
        }).then(data=>{
          this.$store.dispatch('update_resp_active', {respActive:data}).then(()=>{
            this.$router.push('/app/fnd/dashboard')
            this.$toast.open('你好！职责已经切换为：'+lovSelected.respName)
            this.$store.dispatch('update_menu_width', 180)
            this.activeMenu=false
          })
        }).catch(err=>{
          console.log(err)
        })
     },
     toggleMenu(){
      this.activeMenu=!this.activeMenu
     },
     resetPassword(){
      this.resetPasswordProps.userId=this.userinfo.id
      this.isResetPassModalActive=true
      this.$nextTick(() => {
        let rpDom=this.$refs.resetPassword.$el
        document.body.appendChild(rpDom)
        rpDom.style.zIndex=50
      })
    }
  },

  beforeMount(){
    const handler = () => {
      this.activeMenu=false
    }
    window.addEventListener('resize', handler)
  },

  mounted(){
    let toolbar=Bodymovin.loadAnimation({
        container: document.getElementById('jebms-logo'), // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: './static/Bodymovin-Json/dna_like_loader.json' //fidget_spinner  longpress_gesture
    })
    toolbar.play()
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables';

.app-navbar {
  position: fixed;
  min-width: 100%;
  z-index: 19;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .container {
    margin: auto 10px;
  }
  
  img {
    max-height: 1.75rem;
  }

  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
}

.hero-brand {
  .vue {
    margin-left: 10px;
    color: #36AC70;
  }
  .admin {
    color: #28374B;
  }
}

</style>
