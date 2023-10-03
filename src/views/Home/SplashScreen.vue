<template>
  <div
    class="d-flex flex-column justify-start align-stretch"
  >
    <Jumbotron />
    <v-container
      fluid
      class="wrapperClass d-flex flex-column align-content-stretch fill-height"
    >
      <v-col
        cols="12"
        align-self="center"
      >
        <!-- TODO centre vertically -->
        <v-row>
          <v-img
            src="assets/Logo/fairsharing-logo.svg"
            height="220"
            contain
          />
        </v-row>
        <v-row
          justify="center"
          class="intro-row"
        >
          <p
            class="intro-para"
          >
            <a :href="url">FAIRsharing</a> is a curated registry of data and metadata standards,
            databases and data policies.
          </p>
        </v-row>
        <v-row
          justify="center"
          class="intro-row"
        >
          <p
            class="intro-para"
          >
            This Assistant will help you find the standards, databases and policies you need to help make
            your data FAIR.
          </p>
        </v-row>
        <v-row
          justify="center"
          class="intro-row"
        >
          <v-btn
            x-large
            href="/0"
            color="primary"
          >
            Get Started
          </v-btn>
        </v-row>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import Jumbotron from "@/components/Navigation/Jumbotron";

export default {
  name: 'SplashScreen',
  components: {
    Jumbotron
  },
  data() {
    return {
      url: process.env.VUE_APP_FAIRSHARING_URL
    }
  }
};
</script>

<style>
.intro-row {
  font-size: xx-large;
}
.intro-para {
  text-align: center;
}
</style>

