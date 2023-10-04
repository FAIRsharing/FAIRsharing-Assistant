<template>
  <div
    class="d-flex flex-column justify-start align-stretch"
  >
    <Jumbotron />
    <QuestionPage />
  </div>
</template>

<script>
import Jumbotron from "@/components/Navigation/Jumbotron";
import QuestionPage from "@/components/Navigation/QuestionPage.vue"
export default {
  name: 'HomeView',
  components: {
    Jumbotron,
    QuestionPage
  },
};
</script>

