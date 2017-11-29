<template>
  <nav class="level app-levelbar">
    <div class="level-left">
      <div class="level-item">
        <h3 class="subtitle is-5">
          <strong>{{ name }}</strong>
        </h3>
      </div>
      <div class="level-item" v-if="!!codelink">
      </div>
    </div>

    <div class="level-right is-hidden-mobile">
      <!--<breadcrumb :list="list"></breadcrumb>-->
    </div>
  </nav>
</template>

<script>
//import Tooltip from 'vue-bulma-tooltip'
 /*       <tooltip label="View code" placement="right" size="small" :rounded="true">
          <span class="icon">
            <a  :href="codelink">
              <i class="fa fa-github"></i>
            </a>
          </span>
        </tooltip>

import Breadcrumb from 'vue-bulma-breadcrumb'
  components: {
    Breadcrumb
  },

*/

export default {

  data () {
    return {
      list: null
    }
  },

  created () {
    this.getList()
  },

  computed: {
    codelink () {
      if (this.$route.meta && this.$route.meta.link) {
        return 'https://github.com/vue-bulma/vue-admin/blob/master/client/views/' + this.$route.meta.link
      } else {
        return null
      }
    },
    name () {
      return this.$route.meta.title
    }
  },

  methods: {
    getList () {
      let matched = this.$route.matched.filter(item => item.name)
      let first = matched[0]
      if (first && (first.name !== 'Home' || first.path !== '')) {
        matched = [{ name: 'Home', path: '/' }].concat(matched)
      }
      this.list = matched
    }
  },

  watch: {
    $route () {
      this.getList()
    }
  }
}
</script>
