<template>
  <footer class="footer" :style="[hiddenSidebarStyle]">
    <div class="container">
      <div class="content has-text-centered">
        <p class="social">
        </p>
        <p>
          <a :href="'https://github.com/' + repository">
            <span class="icon">
              <i class="fa fa-github"></i>
            </span>
          </a>
          |
          <span class="icon"><i class="fa fa-code"></i></span> with <span class="icon"><i class="fa fa-heart"></i></span> by <a href="https://github.com/samt007">samt007</a>.
        </p>
        <p>Code licensed under <a :href="'https://opensource.org/licenses/mit-license.php'">{{ license }}</a>.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {

  data () {
    return this.$store.state.pkg
  },
  computed: {
    ...mapGetters({
      sidebar: 'sidebar',
      device: 'device',
      global: 'global'
    }),
    hiddenSidebarStyle () {
      if(this.device.isMobile){
        return { 'margin-left': 0, 'width': '100%'}
      }else{
        return this.sidebar.hidden ? { 'margin-left': 0, 'width': '100%'} 
        : { 'margin-left': `${this.global.menuWidth}px`, 'width': `calc(100% - ${this.global.menuWidth}px)` }
      }
    }
  }
  
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/mixins';

.footer {
  
  @include mobile() {
    margin-left: 0;
  }
  
  .social a {
    border-bottom: none !important;
  }

  .fa.fa-heart {
    color: red;
  }
}
</style>
