<template>
  <div class="d-flex flex-column justify-start align-stretch">
    <Jumbotron />
    <v-container
      fluid
      class="wrapperClass d-flex flex-column align-content-stretch fill-height"
    >
      <v-col cols="12" align-self="center">
        <!-- TODO centre vertically -->
        <v-row>
          <v-img
            src="/assets/Logo/fairsharing-logo.svg"
            max-height="220"
            class="contain"
            alt="FAIRsharing-logo"
          />
        </v-row>
        <v-row justify="center" class="intro-row">
          <p class="intro-para">
            <a :href="url">FAIRsharing</a> is a curated informative and
            educational resource on data and metadata standards, inter-related
            to databases and data policies.
          </p>
        </v-row>
        <v-row justify="center" class="intro-row">
          <p class="intro-para">
            This Assistant will help you find the standards, databases and
            policies you need to help make your data FAIR.
          </p>
        </v-row>
        <v-row justify="center" class="intro-row">
          <v-btn size="x-large" href="/0" color="primary"> Get Started </v-btn>
        </v-row>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import Jumbotron from "@/components/Navigation/Jumbotron";
import { mapActions } from "vuex";

export default {
  name: "SplashScreen",
  components: {
    Jumbotron,
  },
  data() {
    return {
      url: import.meta.env.VITE_FAIRSHARING_URL,
    };
  },
  mounted() {
    this.resetMultiTags();
  },
  methods: {
    ...mapActions("multiTagsStore", ["resetMultiTags"]),
  },
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
