<template>
  <flow-form
    ref="flowform"
    :progressbar="false"
    :standalone="true"
    @submit="onSubmit"
  >
    <question
      v-for="(question, index) in questions"
      v-bind="question"
      :key="'m' + index"
      v-model="question.model"
    />
  </flow-form>
</template>

<script>
//import FlowForm, { QuestionModel, QuestionType, ChoiceOption, LanguageModel } from '@ditdot-dev/vue-flow-form';
import FlowForm, { Question } from '@ditdot-dev/vue-flow-form';
import flowchartData from '@/data/flowchartData.json'

export default {
  name: "Flowchart",
  components: {
    FlowForm,
    Question
  },
  data: () => {
    return {
      destinations: flowchartData.destinations,
      questions: flowchartData.questions,
    }
  },
  methods: {
    onSubmit(questionList) {
      console.log(JSON.stringify(questionList));
      // Check the ID of the answered question in the last element
      let answer = questionList.at(-1).answer
      let link = this.destinations[answer];
      //console.log(link);
      let route = this.$router.resolve({ path: link });
      window.open(route.href);
    }
  }

};
</script>


<style scoped>
@import '~@ditdot-dev/vue-flow-form/dist/vue-flow-form.css';
@import '~@ditdot-dev/vue-flow-form/dist/vue-flow-form.theme-purple.css';

</style>
