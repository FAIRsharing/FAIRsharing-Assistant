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
          <v-btn
            v-if="resultCountColour() !== 'error'"
            class="preview-results"
            @click="showResultPreview = true"
          >
            Preview
          </v-btn>
        </v-alert>
      </v-col>
    </v-row>
    <!-- breadcrumb trail -->
    <Breadcrumbs />
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
        <!-- TODO add selected formats here, in a list of chips -->
        <v-text-field
          id="searchString"
          v-model="searchString"
          append-icon="fa-search"
          label="Search model/formats and terminologies"
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
      <v-col
        cols="12"
        class="ml-4"
      >
        <!-- A list here of selected tags is shown just above the text box -->
        <v-chip-group
          class="pl-2"
          column
        >
          <v-chip
            v-for="tag in (recordTags)"
            :key="tag.label"
            class="ma-2"
            :color="colors[tag.model]"
            text-color="white"
          >
            {{ tag.label }}
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <!-- this is a dreadful cheat; without it the close icon becomes unreadable -->
                <div
                  @click="deleteTag(tag.id, tag.model)"
                >
                  <v-icon
                    v-bind="attrs"
                    small
                    class="ml-1"
                    v-on="on"
                  >
                    fa-times-circle
                  </v-icon>
                </div>
              </template>
              <span> Delete tag </span>
            </v-tooltip>
          </v-chip>
        </v-chip-group>
        <!-- end of tags list -->
        <v-text-field
          id="searchString"
          v-model="searchString"
          append-icon="fa-search"
          label="Search names and synonyms"
          outlined
          clearable
          clear-icon="fa-times-circle"
          hide-details
          class="pt-1 mr-10"
          @click:clear="clearResults"
        />
        <v-data-table
          v-if="tags.length > 0"
          v-model="recordTags"
          :headers="tagHeaders"
          :items="tags"
          :items-per-page="10"
          :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
          item-key="label"
          class="elevation-1 mr-10"
          show-select
          calculate-widths
          mobile-breakpoint="900"
          :search-input.sync="searchString"
        >
          <template #[`item.model`]="{ item }">
            <div
              :class="colors[item.model] + '--text'"
              class="noBreak"
            >
              {{ item.model.toUpperCase().replace(/_/g, " ") }}
            </div>
          </template>
          <template #[`item.label`]="{ item }">
            <v-chip
              :class="colors[item.model] + ' white--text noBreak'"
            >
              {{ capitaliseText(item.label, item.model) }}
            </v-chip>
          </template>
          <template #[`item.synonyms`]="{ item }">
            <div
              v-if="item.synonyms"
              class="font-italic limitWidth"
            >
              {{ item.synonyms.join(", ") }}
            </div>
          </template>
        </v-data-table>
      </v-col>
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
          class="full-width d-flex align-center text-center flex-column questionCard"
          height="130"
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
    <v-dialog
      v-model="showResultPreview"
      persistent
    >
      <v-card>
        <v-card-title
          class="headline"
        >
          Current search results
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            persistent
            @click="showResultPreview = false"
          >
            Close
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <ResultTable />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            persistent
            @click="showResultPreview = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import questionSets from "@/data/questionPageData.json";
import {mapActions, mapGetters} from "vuex";
import Loaders from "@/components/Loaders/Loaders.vue";
import multiTagFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilterBrief.json";
import GraphClient from "@/lib/GraphClient/GraphClient";
import tagsQuery from "@/lib/GraphClient/queries/geTags.json";
import ResultTable from "@/components/Results/ResultTable.vue";
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue";

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
  components: { ResultTable, Loaders, Breadcrumbs },
  mixins: [ stringUtils ],
  data: () => {
    return {
      questions: {},
      searchQuery: {},
      hasModelFormatQuery: false,
      hasTagsQuery: false,
      searchString: null,
      searchResults: [],
      recordTags: [],
      tags: [],
      loading: false,
      foundModelFormats: [],
      title: '',
      footer: '',
      history: [],
      showResultPreview: false,
      currentBreadcrumb: null,
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
      tagHeaders: [
        {
          text: "Type of keyword",
          sortable: false,
          value: "model"
        },
        {
          text: "Name",
          sortable: false,
          value: "label"
        },
        {
          text: "Definition",
          sortable: false,
          value: "definitions",
          filterable: false
        },
        {
          text: "Alternative names",
          sortable: false,
          value: "synonyms"
        }
      ],
      colors: {
        domain: 'domain_color',
        taxonomy: 'taxonomic_color',
        subject: 'subject_color',
        user_defined_tag: 'tags_color'
      },
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
      this.searchResults = [];
      val = val.trim();
      await this.getResults(val);
    },
    async recordTags (val) {
      let _module = this;

      _module.loading = true;

      let queryParam =  _module.generateQuery(val);
      await _module.fetchMultiTagData(queryParam);
      // TODO: Handle errors from the server.
      _module.recordsFound = _module.getFairSharingRecords;
      _module.$store.commit('multiTagsStore/setQueryParams', queryParam);
      _module.$store.commit('multiTagsStore/setSelectedTags', val);
      _module.loading = false;
    },
  },
  mounted() {
    this.getQuestions()
  },
  methods: {
    ...mapActions('multiTagsStore', ['fetchMultiTagData', 'resetMultiTags']),
    getQuestions() {
      try {
        this.searchString = null;
        this.currentBreadcrumb = questionSets.questionSets[parseInt(this.$route.params.id)].breadcrumb;
        this.questions = questionSets.questionSets[parseInt(this.$route.params.id)].questions;
        this.searchQuery = questionSets.questionSets[parseInt(this.$route.params.id)].searchQuery;
        this.hasModelFormatQuery = questionSets.questionSets[parseInt(this.$route.params.id)].hasModelFormatQuery;
        this.hasTagsQuery = questionSets.questionSets[parseInt(this.$route.params.id)].hasTagsQuery;
        let path = '/' + questionSets.questionSets[parseInt(this.$route.params.id)].path;
        this.$store.commit('navigationStore/setNavigationState', path);

        // The current page isn't a link, only previous pages.
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
      // Always stash the breadcrumb.
      // Some questions have a query that must be run when the question is clicked.
      if (!(Object.keys(query).length === 0)) {
        this.loading = true;
        // There may be some additional parameters set as a result of the user having made a special selection
        // on this page, e.g. when searching for models/formats.
        if (this.foundModelFormats.length > 0) {
          let ids = [];
          let names = [];
          this.foundModelFormats.forEach(function(format) {
            ids.push(format.id);
            names.push(format.name);
          })
          query['dataFormatsAndTerminologies'] = ids;
          this.$store.commit('navigationStore/setComplianceState', names.join(', '));
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
      // In this case, the link is to an external site.
      if (link.match(/^http/)) {
        window.open(link);
      }
      // Whereas here, it's linking to somewhere else within the assistant.
      else {
        if (this.$route.params.id) {
          this.history.push(this.$route.params.id);
        }
        else {
          this.history.push(0);
        }
        this.$router.push({path: link});
      }
      this.$store.commit('navigationStore/pushBreadcrumb', this.currentBreadcrumb);
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
      // A different query is run depending on whether hasTagsQuery or hasModelFormatQuery is true.
      let _module = this;
      if (_module.hasModelFormatQuery) {
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
        // This m_t_f execution isn't to do the normal search, just to return databases implementing standards.
        let searchResults = await graphClient.executeQuery(filterCopy);
        if (!searchResults.error) {
          _module.searchResults = searchResults.multiTagFilter;
        }
      }
      else if (_module.hasTagsQuery) {
        let tagQueryCopy = JSON.parse(JSON.stringify(tagsQuery));
        if (queryString) tagQueryCopy.queryParam = {q: queryString};
        let tags = await graphClient.executeQuery(tagQueryCopy);
        if (!tags.error) {
          _module.tags = tags.searchTags;
        }
      }
    },
    clearResults() {
      this.loading = false;
      this.tags = [];
      this.searchResults = [];
    },
    generateQuery(val) {
      let query = this.getQueryParams;
      delete query.domains;
      delete query.subjects;
      delete query.taxonomies;
      delete query.userDefinedTags;
      let domains = val.filter(x => x.model === 'domain').map(x => x.label);
      if (domains.length) {
        query['domains'] = domains;
      }
      let subjects = val.filter(x => x.model === 'subject').map(x => x.label);
      if (subjects.length) {
        query['subjects'] = subjects;
      }
      let taxonomies = val.filter(x => x.model === 'taxonomy').map(x => x.label);
      if (taxonomies.length) {
        query['taxonomies'] = taxonomies;
      }
      let user_defined_tags = val.filter(x => x.model === 'user_defined_tag').map(x => x.label);
      if (user_defined_tags.length) {
        query['userDefinedTags'] = user_defined_tags;
      }
      return query;
    },
    deleteTag(tagId, tagModel) {
      this.recordTags = this.recordTags.filter(el => el.id !== tagId && el.model !== tagModel);
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
  //height: 30px;
  padding: 30px;
}
.cardSmall {
  //height: 60px;
  padding: 60px;
}
.cardMedium {
  //height: 80px;
  padding: 80px;
}
.cardLarge, .cardXtraLarge {
  min-height: 100px;
  padding: 50px;
}

// TODO: This isn't entirely effective on small screens...
.preview-results {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

</style>
