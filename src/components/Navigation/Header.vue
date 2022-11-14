<template>
  <v-app-bar
      id="mainHeader"
      short
      height="150"
      max-height="150"
      class="header-container"
      :class="[{'largeScreen': $vuetify.breakpoint.xlOnly}, {'smallScreen': $vuetify.breakpoint.mdAndDown}]"
  >
    <!-- First Level Menu -->
    <div
        class="navFirst d-flex"
        :class="{'full-width': $vuetify.breakpoint.mdAndDown}"
    >
      <router-link to="/">
          <span class="blue">FAIR</span><span class="black">assist</span><span class="blue">.org</span>
      </router-link>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Header',

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blue {
  color: #36A9E1;
}
.black {
  color: initial;
}

</style>
