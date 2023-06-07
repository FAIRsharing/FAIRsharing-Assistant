<template>
  <v-container
    fluid
    class="wrapperClass d-flex flex-column align-content-stretch"
  >
    <v-row
      v-for="(question, index) in questions"
      :key="'question_' + index"
      dense
      class="align-stretch justify-center fill-height"
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
          class="full-width d-flex align-stretch flex-column questionCard"
          elevation="4"
          :class="[
            item.color,
            {
              'cardXtraSmall pa-2': $vuetify.breakpoint.xsOnly,
              'cardSmall pa-4': $vuetify.breakpoint.smOnly,
              'cardMedium pa-4': $vuetify.breakpoint.mdAndUp,
              'cardLarge pa-6': $vuetify.breakpoint.lgAndUp,
              'cardXtraLarge pa-6': $vuetify.breakpoint.xlOnly,
            }
          ]"
          @click="processLink(item.link)"
        >
          <div class="d-flex align-center">
            <v-card-text
              class="white--text font-weight-medium text-xl-h4 text-lg-h5 text-md-h5 text-sm-h5 text-xs-h5 questionText"
            >
              <!-- This html is from a safe source -->
              <!-- eslint-disable vue/no-v-html -->
              <span
                v-html="item.question"
              />
            <!-- eslint-enable vue/no-v-html -->
            </v-card-text>
            <v-img
              v-if="item.image_icon"
              color="white"
              contain
              max-width="165"
              :width="$vuetify.breakpoint.smAndDown ? 50 : '100%' "
              :height="$vuetify.breakpoint.smAndDown ? 50 : '165' "
              :src="$vuetify.icons.values[item.image_icon].icon"
            />
          </div>
          <v-icon
            v-if="item.extra_icon"
            color="white"
            class="pabsolute opacity-medium"
            contain
            :size="30"
            :large="$vuetify.breakpoint.smAndUp"
            :x-large="$vuetify.breakpoint.lgAndUp"
            style="bottom: 5px; right: 70px"
          >
            {{ $vuetify.icons.values[item.extra_icon].icon }}
          </v-icon>
          <v-icon
            color="white"
            class="pabsolute opacity-medium"
            contain
            size="30"
            :large="$vuetify.breakpoint.smAndUp"
            :x-large="$vuetify.breakpoint.lgAndUp"
            style="bottom: 5px; right: 10px"
          >
            {{ $vuetify.icons.values[item.icon].icon }}
          </v-icon>
        </v-card>
      </v-col>
    </v-row>
    <!-- Back Button -->
    <v-row
      v-if="previousLink"
      class="align-stretch justify-center previousButton"
    >
      <v-col
        cols="12"
        lg="10"
        md="10"
        sm="12"
      >
        <v-btn
          class="white--text"
          elevated
          default
          color="red darken-4"
          :disabled="!history.length"
          @click="goBack()"
        >
          <v-img
            src="/assets/Home/Arrow/whiteArrow.png"
            class="mr-1"
            :width="20"
            :height="20"
            style="transform: rotate(180deg)"
          />
          Previous step
        </v-btn>
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
      questions: {},
      history: [],
      previousLink: ""
    }
  },
  watch: {
    '$route' () {
      this.getQuestions();
    }
  },
  mounted() {
    this.getQuestions()
    localStorage.clear();
  },
  methods: {
    getQuestions() {
      try {
        this.questions = questionSets.questionSets[parseInt(this.$route.params.id)].rows;
        this.previousLink = questionSets.questionSets[parseInt(this.$route.params.id)].previousLink
        this.history.push(this.previousLink);
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
        if (this.$route.params.id) {
          this.history.push(this.$route.params.id);
        }
        else {
          this.history.push(0);
        }
        this.$router.push({path: link});
      }
    },
    goBack() {
      let previous = this.history.pop();
      this.$router.push({path: "/" + previous});
    }
  }
};
</script>

<style scoped lang="scss">
.wrapperClass{
  position: relative;
}

.smallScreen {
  height: auto;
}

.questionCard {
  transform: translateY(20px);
  z-index: 1;
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

.previousButton {
  animation: fadeIn 3s;
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
}

.cardXtraSmall {
  height: 100px;
}
.cardSmall {
  height: 150px;
}
.cardMedium {
  height: 250px;
}
.cardLarge, .cardXtraLarge {
  height: 250px;
}

</style>
