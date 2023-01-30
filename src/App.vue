<template>
  <v-app id="app">
    <v-main>
      <!--      <Menu />-->
      <!--      <Jumbotron />-->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import Menu from "@/components/Navigation/Menu"
// import Jumbotron from "@/components/Navigation/Jumbotron";

export default {
  name: 'App',
  components: {
    // Menu,
    // Jumbotron
  },
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
</style>
