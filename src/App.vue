<template>
  <v-app id="app">
    <div class="d-flex appWrapper fill-height flex-column justify-space-between">
      <router-view />
      <Footer />
    </div>
  </v-app>
</template>

<script>
import Footer from "@/components/Others/Footer.vue";
export default {
  name: 'App',
  components:{Footer},
  data() {
    return {
      loading:true,
    }
  },
  /* istanbul ignore next */
  async updated() {
    // very important line of code which prevents layout shifting which is considered as one negative point for SEO
    await this.$nextTick()
    this.loading = false;
  }
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 99vh;
}

html, body {
  height: 100%;
}

.appWrapper {
  position: relative;
  height: 100%;
}
</style>
