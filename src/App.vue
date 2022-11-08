<template>
  <v-app id="app">


    <v-main>
      <TabsView />
      <router-view />

    </v-main>
  </v-app>
</template>

<script>
import TabsView from "@/views/TabsView"

export default {
  name: 'App',

  components: {
    TabsView
  },

  data: () => ({
    //
  }),
};
</script>
