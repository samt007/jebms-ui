<template>
  <section class="app-main" :style="[hiddenSidebarStyle]">
    <div class="container is-fluid is-marginless app-content">
      <levelbar></levelbar>
      <transition
        mode="out-in"
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
        appear>
        <router-view class="animated"></router-view>
      </transition>
    </div>
  </section>
</template>

<script>
import Levelbar from './Levelbar'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      sidebar: 'sidebar',
      device: 'device'
    }),
    hiddenSidebarStyle () {
      if(this.device.isMobile){
        return { 'margin-left': 0 }
      }else{
        return this.sidebar.hidden ? { 'margin-left': 0 } : { 'margin-left': this.$store.state.global.menuWidth+'px' }
      }
    }
  },

  components: {
    Levelbar
  }
}

/*
.app-main {
  padding-top: 50px;
  margin-left: 180px;
  transform: translate3d(0, 0, 0);

  @include mobile() {
    margin-left: 0;
  }

}

  @include mobile() {
    margin-left: 0;
  }
 */

</script>

<style lang="scss">
@import '~bulma/sass/utilities/initial-variables';
@import '~bulma/sass/utilities/mixins';

.app-main {
  padding-top: 50px;
  overflow: auto;
  /*background-color: #f0f0f0;*/
  z-index: 1;
  transition: left .3s;
  min-height: calc(100vh - 90px);
}

.app-content {
  padding: 20px;
}
</style>
