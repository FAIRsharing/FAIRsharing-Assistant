<template>
  <v-container
    fluid
    class="wrapperClass fill-height d-flex align-stretch align-content-stretch"
  >
    <v-row
      v-for="(question, index) in questions"
      :key="'question_' + index"
      dense
      class="align-stretch justify-center"
    >
      <v-col
        v-for="item in question"
        :key="item.id"
        cols="12"
        lg="5"
        md="5"
        sm="12"
      >
        <v-card
          class="full-width d-flex align-stretch flex-column pa-6 questionCard fill-height"
          elevation="4"
          :class="item.color"
          @click="processLink(item.link)"
        >
          <v-card-text
            class="full-width white--text font-weight-medium text-xl-h4 text-lg-h5 text-md-h5 text-sm-h5 text-xs-h5 questionText"
          >
            {{ item.question }}
          </v-card-text>
          <v-img
            :src="item.arrow"
            class="pabsolute questionText"
            contain
            width="100"
            height="100"
            style="bottom: 0; right: 40px"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import questionSets from "@/data/landingPageData.json";
export default {
  name: 'LandingPage',
  data: () => {
    return {
      questions: {}
    }
  },
  watch: {
    '$route' () {
      this.getQuestions();
    }
  },
  mounted() {
    this.getQuestions();
  },
  methods: {
    getQuestions() {
      try {
        this.questions = questionSets.questionSets[parseInt(this.$route.params.id)].rows;
      }
      catch {
        this.questions = questionSets.questionSets[0].rows;
      }
    },
    processLink(link) {
      if (link.match(/^http/)) {
        window.open(link);
      }
      else {
        this.$router.push({path: link})
      }
    }
  }
};
</script>

<style scoped lang="scss">
.wrapperClass{
  position: relative;
  z-index: 1;
}

.smallScreen {
  height: auto;
}

.questionCard {
  transform: translateY(20px);
  animation: smooth-appear 1250ms ease forwards;
  @keyframes smooth-appear {
    from{
      bottom: -300%;
      opacity:0;
    }
    to{
      bottom: 20px;
      opacity:1;
    }
  }
}

.questionTitle {
  position: relative;
  transition-duration: inherit;
  transform: translateY(-20px);
  animation: smooth-title 2000ms ease-in forwards;
  @keyframes smooth-text {
    0%,
    25% {
      opacity: 0;
    }
    75%,
    100% {
      opacity: 1;
    }
  }
}

.questionText {
  transition-duration: inherit;
  transform: translateX(0);
  animation: smooth-text 2000ms ease-in forwards;
  @keyframes smooth-text {
    0%,
    25% {
      opacity: 0;
    }
    75%,
    100% {
      opacity: 1;
    }
  }
}

</style>
