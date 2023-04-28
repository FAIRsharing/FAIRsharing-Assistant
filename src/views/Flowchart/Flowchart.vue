<template>
  <div class="d-flex flex-column justify-start align-stretch">
    <Jumbotron />
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
      <template #complete>
        <div class="f-section-wrap">
          <p>
            <span class="fh2">Finished!</span>
            <span class="f-section-text">
              Click submit or press Enter to be redirected to the relevant resource.
            </span>
          </p>
        </div>
      </template>
    </flow-form>
  </div>
</template>

<script>
//import FlowForm, { QuestionModel, QuestionType, ChoiceOption, LanguageModel } from '@ditdot-dev/vue-flow-form';
import FlowForm, { Question } from '@ditdot-dev/vue-flow-form';
import Jumbotron from "@/components/Navigation/Jumbotron";
import flowchartData from '@/data/flowchartData.json'

export default {
  name: "Flowchart",
  components: {
    FlowForm,
    Question,
    Jumbotron
  },
  data: () => {
    return {
      destinations: flowchartData.destinations,
      questions: flowchartData.questions
    }
  },
  methods: {
    onSubmit(questionList) {
      console.log(JSON.stringify(questionList));
      // Check the ID of the answered question in the last element
      let answer = questionList.at(-1).answer
      let link = this.destinations[answer];
      window.open(link);
    }
  }

};
</script>


<style scoped>
@import '~@ditdot-dev/vue-flow-form/dist/vue-flow-form.css';
//@import '~@ditdot-dev/vue-flow-form/dist/vue-flow-form.theme-minimal.css';
@import '@/styles/flowchart/fairsharing_flowchart.css';
</style>
