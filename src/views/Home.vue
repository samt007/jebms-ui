<template>
  <div class="main">
    <navbar :show="true"></navbar>
    <sidebar :show="sidebar.opened && !sidebar.hidden"></sidebar>
    <app-main></app-main>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, FooterBar } from '@/components/layout/'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Navbar,
    Sidebar,
    AppMain,
    FooterBar
  },

  beforeMount () {
    const { body } = document
    const WIDTH = 768
    const RATIO = 3

    const handler = () => {
      if (!document.hidden) {
        let rect = body.getBoundingClientRect()
        let isMobile = rect.width - RATIO < WIDTH
        this.toggleDevice(isMobile ? 'mobile' : 'other')
        this.toggleSidebar({
          opened: !isMobile
        })
      }
    }

    document.addEventListener('visibilitychange', handler)
    window.addEventListener('DOMContentLoaded', handler)
    window.addEventListener('resize', handler)

    handler()
  },

  computed: mapGetters({
    sidebar: 'sidebar'
  }),

  methods: mapActions([
    'toggleDevice',
    'toggleSidebar'
  ])
}

//$fa-font-path: '~mdi/fonts/';
//@import '~mdi/scss/materialdesignicons';
//@import '~bulma';

</script>


<style lang="scss">

.main {
    position: absolute;
    width: 100%;
    height: 100%;
}

.footer {
    padding: 0 0 0 0;
}

</style>
