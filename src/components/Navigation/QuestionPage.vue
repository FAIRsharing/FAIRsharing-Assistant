<template>
  <v-container
    fluid
    class="wrapperClass d-flex flex-column align-content-stretch"
  >
    <v-fade-transition v-if="loading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <!-- how many results so far? -->
    <!-- TODO: Some means to reset these query params will be necessary -->
    <v-row
      v-if="Object.keys(getQueryParams).length > 0"
    >
      <v-col
        cols="12"
      >
        <v-alert
          density="compact"
          :type="resultCountColour()"
          variant="tonal"
        >
          There are {{ getFairSharingRecords.length }} {{ getCurrentRegistry }} records matching your selection.
        </v-alert>
      </v-col>
    </v-row>
    <!-- breadcrumb trail -->
    <v-row>
      <v-col
        cols="12"
        class="ml-4"
      >
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <span
          class="ma-4"
          v-html="breadcrumbs"
        />
        <!-- eslint-enable vue/no-v-html -->
      </v-col>
    </v-row>
    <!-- question title -->
    <v-row>
      <v-col
        cols="12"
      >
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <h1
          style="text-align: center"
          v-html="title"
        />
        <!-- eslint-enable vue/no-v-html -->
      </v-col>
    </v-row>
    <!-- A special query box if the question asks for model/format searching  -->
    <v-row
      v-if="hasModelFormatQuery"
    >
      <v-col
        cols="12"
        class="ml-4"
      >
        <v-text-field
          id="searchString"
          v-model="searchString"
          append-icon="fa-search"
          label="Search model/formats"
          outlined
          clearable
          clear-icon="fa-times-circle"
          hide-details
          class="pt-1 mr-10"
          @click:clear="clearResults"
        />
        <!-- drop-down table for searchResults to go here -->
        <v-data-table
          v-if="searchResults.length > 0"
          v-model="foundModelFormats"
          :headers="headers"
          :items="searchResults"
          :items-per-page="10"
          :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
          item-key="id"
          class="elevation-1 mr-10"
          show-select
          calculate-widths
          mobile-breakpoint="900"
          :loading="resultsLoading"
          loading-text="Please wait, results are loading"
          :search-input.sync="searchString"
        >
          <template #[`item.name`]="{ item }">
            <div
              v-if="item.name"
            >
              {{ item.name }}
            </div>
          </template>
          <template #[`item.abbreviation`]="{ item }">
            <div
              v-if="item.abbreviation"
            >
              {{ item.abbreviation }}
            </div>
          </template>
        </v-data-table>
        <!-- end of temp results data table -->
      </v-col>
    </v-row>
    <!-- A special query box if the question asks for model/format searching  -->
    <v-row
      v-if="hasTagsQuery"
    >
      <p>A query box for search for tags will go here.</p>
    </v-row>
    <!-- question options -->
    <v-row
      class="align-stretch justify-center fill-height"
    >
      <v-col
        v-for="item in questions"
        :key="item.id"
        cols="3"
      >
        <v-card
          class="full-width d-flex align-stretch flex-column questionCard"
          elevation="4"
          :class="[
            item.color,
            {
              'cardXtraSmall pa-0': $vuetify.breakpoint.xsOnly,
              'cardSmall pa-2': $vuetify.breakpoint.smOnly,
              'cardMedium pa-2': $vuetify.breakpoint.mdAndUp,
              'cardLarge pa-4': $vuetify.breakpoint.lgAndUp,
              'cardXtraLarge pa-4': $vuetify.breakpoint.xlOnly,
            }
          ]"
          @click="processLink(item.link, item.query, item.message, item.refined)"
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
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- question footer -->
    <v-row>
      <v-col
        cols="12"
      >
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <h3
          style="text-align: center"
          v-html="footer"
        />
        <!-- eslint-enable vue/no-v-html -->
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        style="text-align: center"
      >
        <v-btn
          class="mr-2"
          :block="$vuetify.breakpoint.smAndDown"
          color="dev_color white--text"
          @click="$router.push({path: '/researchfields'});"
        >
          Search directly
        </v-btn>
        <v-btn
          v-if="Object.keys(getQueryParams).length > 0"
          class="ml-2"
          :block="$vuetify.breakpoint.smAndDown"
          color="dev_color white--text"
          @click="$router.push({path: '/results'});"
        >
          View results
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import questionSets from "@/data/questionPageData.json";
import {mapActions, mapGetters} from "vuex";
import Loaders from "@/components/Loaders/Loaders.vue";
import multiTagFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilterBrief.json";
import GraphClient from "@/lib/GraphClient/GraphClient";

const graphClient = new GraphClient();

/*
 * searchQuery is a query that will be used for getting additional info., e.g. models/formats, which will constrain
 * the user's search to some special case. It will be used to create a text search box on the page when the questions
 * are loaded.
 * searchString is whatever search term is to be passed to the searchQuery.
 * query is simply some params which must be passed to the multiTagFilter when the question is clicked upon.
 */

export default {
  name: 'QuestionPage',
  components: { Loaders },
  data: () => {
    return {
      questions: {},
      searchQuery: {},
      hasModelFormatQuery: false,
      hasTagsQuery: false,
      searchString: null,
      searchResults: [],
      resultsLoading: false,
      breadcrumbs: '',
      foundModelFormats: [],
      title: '',
      footer: '',
      history: [],
      loading: false,
      // This is silly, but I was in a rush and had enough with fighting javascript;
      registrySwitch: {
        database: 'Database',
        policy: 'Policy',
        standard: 'Standard',
        collection: 'Collection'
      },
      headers: [
        {
          text: "Name",
          sortable: false,
          value: "name"
        },
        {
          text: "Abbreviation",
          sortable: false,
          value: "abbreviation"
        }
      ],
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getCurrentRegistry","getQueryParams"]),
  },
  watch: {
    '$route' () {
      this.getQuestions();
    },
    async searchString(val){
      if (!val || val.length < 3) {
        return;
      }
      this.resultsLoading = true;
      this.searchResults = [];
      val = val.trim();
      await this.getResults(val);
      this.resultsLoading = false;
    },
  },
  mounted() {
    this.getQuestions()
  },
  methods: {
    ...mapActions('multiTagsStore', ['fetchMultiTagData', 'resetMultiTags']),
    getQuestions() {
      try {
        // TODO: At some point these breadcrumbs might have to incorporate a variable from the user's search query...
        const crumbRoot = "<a href='/'>Home</a> > <a href='/0'>Start</a>";
        this.questions = questionSets.questionSets[parseInt(this.$route.params.id)].questions;
        this.searchQuery = questionSets.questionSets[parseInt(this.$route.params.id)].searchQuery;
        this.hasModelFormatQuery = questionSets.questionSets[parseInt(this.$route.params.id)].hasModelFormatQuery;
        this.hasTagsQuery = questionSets.questionSets[parseInt(this.$route.params.id)].hasTagsQuery;
        let path = '/' + questionSets.questionSets[parseInt(this.$route.params.id)].path;
        this.$store.commit('navigationStore/setNavigationState', path);
        if (questionSets.questionSets[parseInt(this.$route.params.id)].breadcrumbs) {
          this.breadcrumbs = crumbRoot + " > " + questionSets.questionSets[parseInt(this.$route.params.id)].breadcrumbs;
        }
        else {
          this.breadcrumbs = crumbRoot;
        }
        this.title = questionSets.questionSets[parseInt(this.$route.params.id)].title;
        this.footer = questionSets.questionSets[parseInt(this.$route.params.id)].footer;
        if (questionSets.questionSets[parseInt(this.$route.params.id)].clear) {
          this.resetMultiTags();
        }
      }
      catch {
        this.questions = questionSets.questionSets[0].questions;
      }
    },
    async processLink(link, query, message, refined) {
      if (!(Object.keys(query).length === 0)) {
        this.loading = true;
        // There may be some additional parameters set as a result of the user having made a special selection
        // on this page, e.g. when searching for models/formats.
        if (this.foundModelFormats.length > 0) {
          let ids = [];
          this.foundModelFormats.forEach(function(format) {
            ids.push(format.id);
          })
          query['dataFormatsAndTerminologies'] = ids;
        }
        await this.fetchMultiTagData(query);
        this.$store.commit('multiTagsStore/setQueryParams', query);
        if (refined) {
          this.$store.commit('multiTagsStore/setRefinedStatus', refined);
        }
        if (message) {
          this.$store.commit('multiTagsStore/setSelectionMessage', message);
        }
        if (query['fairsharingRegistry']) {
          this.$store.commit('multiTagsStore/setCurrentRegistry', this.registrySwitch[query['fairsharingRegistry'][0]]);
        }
        this.loading = false;
      }
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
    resultCountColour() {
      if (this.getFairSharingRecords.length > 10) {
        return "success";
      }
      else if (this.getFairSharingRecords.length > 0 && this.getFairSharingRecords.length <= 10) {
        return "warning";
      }
      return "error";
    },
    async getResults(queryString) {
      let queryCopy = JSON.parse(JSON.stringify(this.searchQuery));
      let filterCopy = JSON.parse(JSON.stringify(multiTagFilter));
      if (queryString) {
        queryCopy['q'] = queryString;
      }
      else {
        this.searchResults = [];
        return;
      }
      filterCopy.queryParam = queryCopy;
      // TODO: Insert queryCopy into multiTagsFilter
      // TODO: This mtf execution isn't to do the normal search, just to return databases implementing standards.
      let searchResults = await graphClient.executeQuery(filterCopy);
      if (!searchResults.error) {
        this.searchResults = searchResults.multiTagFilter;
      }
    },
    clearResults() {
      this.resultsLoading = false;
      this.searchResults = [];
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

.cardXtraSmall {
  height: 30px;
}
.cardSmall {
  height: 70px;
}
.cardMedium {
  height: 100px;
}
.cardLarge, .cardXtraLarge {
  height: 150px;
}

</style>
