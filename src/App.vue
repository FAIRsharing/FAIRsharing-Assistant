<template>
  <v-app id="app">
    <v-main>
      <Menu />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Menu from "@/components/Navigation/Menu"

export default {
  name: 'App',
  components: {
    Menu
  },
};
</script>
