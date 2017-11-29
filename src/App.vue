<template>
  <div id="app">
    <nprogress-container></nprogress-container>
    <router-view></router-view>
  </div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'

export default {
  components: {
    NprogressContainer
  },

  beforeMount () {
  }
}

/*
@import '~animate.css';
@import '~wysiwyg.css/wysiwyg.sass';
@import '~font-awesome/scss/font-awesome';
$fa-font-path: '~font-awesome/fonts/';
*/
</script>


<style lang="scss">

.animated {
  animation-duration: .377s;
}

@import '~buefy/lib/buefy.css';

html {
  /*background-color: whitesmoke;*/
  font-size: 87.5%;
  overflow-y: auto;
}

.nprogress-container {
  position: fixed !important;
  width: 100%;
  height: 50px;
  z-index: 2048;
  pointer-events: none;

  #nprogress {
    $color: #48e79a;

    .bar {
      background: $color;
    }
    .peg {
      box-shadow: 0 0 10px $color, 0 0 5px $color;
    }

    .spinner-icon {
      border-top-color: $color;
      border-left-color: $color;
    }
  }
}

</style>
