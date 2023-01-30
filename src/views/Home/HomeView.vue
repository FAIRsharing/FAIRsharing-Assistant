<template>
  <div class="fill-height d-flex flex-column justify-start align-stretch">
    <Jumbotron />
    <LandingPage />
  </div>
</template>

<script>
import Jumbotron from "@/components/Navigation/Jumbotron";
import LandingPage from "@/components/Navigation/LandingPage"
export default {
  name: 'HomeView',
  components: {
    Jumbotron,
    LandingPage
  },
};
</script>

