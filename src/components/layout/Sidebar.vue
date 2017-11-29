<template>
  <aside class="menu app-sidebar animated" 
    :class="{ slideInLeft: show, slideOutLeft: !show }"
    :style="`width:${this.$store.state.global.menuWidth}px`">
    <div class="media user-panel">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src="static/img/avatar5.png" class="img-circle" alt="User Image">
          </figure>
        </div>
        <div class="media-content">
          <div class="info">
          <p>{{this.userinfo.username}}</p>
          <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
          </div>
        </div>
    </div>

    <p class="menu-label">
      <strong>当前职责：{{this.respActive.respName}}</strong>
    </p>
    <ul class="menu-list">
      <li>
        <router-link to="/app/fnd/dashboard">
          <i class="fa fa-dashboard"></i> <span>Dashboard</span>
        </router-link>
      </li>
      <menu-item v-for='(item,key,index) in this.respActive.menuVOs' 
        :menu="item" :key="item.menuId+'-'+item.menuSequence">
      </menu-item>
    </ul>
  </aside>
</template>

<script>

import Vue from 'vue';
Vue.component('menu-item', {
  template: `
      <li v-if="innerMenu.leaf==false">
        <a href="#" @click.prevent="toggle()" :aria-expanded="expanded">
          <i :class="innerMenu.subMenuIconCode"></i>
          <span>{{innerMenu.prompt}}</span>
          <span class="icon is-small is-angle">
            <i class="fa fa-angle-down"></i>
          </span>
        </a>
        <ul class="collapse in" v-show="expanded">
          <menu-item v-for='(item,index) in innerMenu.children' :menu="item" :key="item.menuId+'-'+item.menuSequence">
          </menu-item>
        </ul>
      </li>
      <li v-else>
        <router-link :to="innerMenu.functionHref">
            <i :class="innerMenu.functionIconCode"></i> 
            <span>{{innerMenu.prompt}}</span>
        </router-link>
      </li>
  `,
  props:{
     menu: {
        type: Object,
        default() {return {};}
     }
  },
  data () {
    return {
      innerMenu:this.menu,
      expanded:false
    }
  },
  computed:{
  },
  methods:{
    toggle () {
      this.expanded=!this.expanded
      if(this.expanded===true){
        this.$store.dispatch('update_menu_width', this.$store.state.global.menuWidth+10)
      }else{
        this.$store.dispatch('update_menu_width', this.$store.state.global.menuWidth-10)
      }
    },
  }
})

export default {

  props: {
    show: Boolean
  },

  data () {
    return {
    }
  },

  computed:{
       userinfo(){
          return this.$store.state.user.userinfo
       },
       respList(){
          return this.$store.state.user.respList
       },
       respActive(){
          return this.$store.state.user.respActive
       }
  },

  methods: {
  },

  mounted () {
    //console.log(this.respActive)
  },

  watch: {
    $route (route) {
      //this.isReady = true
      //this.shouldExpandMatchItem(route)
    }
  }

}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables';
@import '~bulma/sass/utilities/mixins';

.app-sidebar {
  position: fixed;
  top: 45px;
  left: 0;
  bottom: 0;
  padding: 5px 0 50px;
  /*width: 180px;*/
  min-width: 45px;
  max-height: 100vh;
  height: calc(100% - 1px);
  z-index: 19 - 1;
  background: #FFF;
  background-color: #f0f0f0;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);
  overflow-y: auto;
  overflow-x: hidden;

  @include mobile() {
    transform: translate3d(-180px, 0, 0);
  }

  .icon {
    vertical-align: baseline;
    &.is-angle {
      position: absolute;
      right: 10px;
      transition: transform .377s ease;
    }
  }

  .menu-label {
    padding-left: 12px;
    color: #444;
  }

  .menu-list {
    li a {
      &[aria-expanded="true"] {
        .is-angle {
          transform: rotate(180deg);
        }
      };
      border-radius: 0;
      font-size:0.9rem;
      padding: 10px 4px 10px 12px;
      display: block;
    }

    li a i.fa{
      width: 20px;
    }

    li a + ul {
      margin: 0 10px 0 15px;
    }

    line-height: inherit;

    li ul a {
        font-size: 0.9rem;
        padding: 6px 4px 6px 12px;
    }

  }

}

.img-circle {
    border-radius: 50%;
}

.user-panel {
    width: 100%;
    padding: 10px;
    overflow: hidden;
}

.user-panel .info {
    padding: 5px 5px 5px 15px;
    line-height: 1;
    position: absolute;
    left: 55px;
}

.user-panel .info > a {
    text-decoration: none;
    padding-right: 5px;
    margin-top: 3px;
    font-size: 11px;
}

.user-panel .info > p {
    font-weight: 600;
    margin-bottom: 9px;
}

.user-panel .info, .user-panel .info > a {
    color: #444;
}

</style>
