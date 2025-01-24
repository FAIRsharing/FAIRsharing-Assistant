<template>
  <div>
    <Jumbotron />
    <RefineQuestionSelection />
  </div>
</template>

<script>
import Jumbotron from "@/components/Navigation/Jumbotron";
import RefineQuestionSelection from "@/components/RefineSelection/RefineQuestionSelection.vue";

export default {
  name: "RefineFromQuestions",
  components: {
    RefineQuestionSelection,
    Jumbotron,
  },
};
</script>
