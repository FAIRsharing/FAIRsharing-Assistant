<template>
  <v-container
    fluid
    class="wrapperClass d-flex flex-column align-content-stretch"
  >
    <v-fade-transition v-if="loading">
      <div>
        <v-overlay
          :model-value="loading"
          :absolute="false"
          opacity="0.8"
          class="align-center justify-center"
        >
          <Loaders />
        </v-overlay>
      </div>
    </v-fade-transition>
    <!-- how many results so far? -->
    <ResultPreviewBanner
      :show-banner="Object.keys(getQueryParams).length > 0"
    />
    <!-- breadcrumb trail -->
    <Breadcrumbs />
    <!-- question title -->
    <v-row>
      <v-col cols="12">
        <!-- This html is from a safe source -->
        <h1 style="text-align: center">
          {{ title }}
        </h1>
      </v-col>
    </v-row>
    <!-- A special query box if the question asks for model/format searching  -->
    <v-row v-if="hasModelFormatQuery">
      <v-col cols="12" class="ml-4">
        <!-- A list here of selected standards is shown just above the text box -->
        <div class="pl-2">
          <v-chip
            v-for="std in foundModelFormats"
            :key="std.name"
            class="ma-2"
            close-icon="fa fa-trash"
            closable
            @click:close="deleteStandard(std.id)"
          >
            {{ std.abbreviation || std.name }}
          </v-chip>
        </div>
        <!-- end of standard list -->
        <v-text-field
          id="searchString"
          v-model="searchString"
          append-inner-icon="fa fa-search"
          label="Search model/formats and terminologies"
          variant="outlined"
          clearable
          clear-icon="fa fa-times-circle"
          hide-details
          class="pt-1 mr-10"
          color="primary"
          @click:clear="clearResults"
        />
        <!-- drop-down table for searchResults to go here -->
        <v-data-table
          v-if="
            searchResults.length > 0 && searchString && searchString.length > 0
          "
          v-model="foundModelFormats"
          v-model:search-input="searchString"
          :headers="headers"
          :items="searchResults"
          :items-per-page="10"
          :footer-props="{ 'items-per-page-options': [10, 20, 30, 40, 50] }"
          item-key="id"
          class="elevation-1 mr-10"
          show-select
          calculate-widths
          mobile-breakpoint="900"
          return-object
        >
          <template #[`item.name`]="{ item }">
            <div v-if="item.name">
              {{ item.name }}
            </div>
          </template>
          <template #[`item.abbreviation`]="{ item }">
            <div v-if="item.abbreviation">
              {{ item.abbreviation }}
            </div>
          </template>
        </v-data-table>
        <!-- end of temp results data table -->
      </v-col>
    </v-row>
    <!-- A special query box if the question asks for model/format searching  -->
    <v-row v-if="hasTagsQuery">
      <v-col cols="12" class="ml-4">
        <!-- A list here of selected tags is shown just above the text box -->
        <div class="pl-2">
          <v-chip
            v-for="tag in recordTags"
            :key="tag.label"
            class="ma-2"
            :color="colors[tag.model]"
            variant="flat"
            close-icon="fa fa-trash"
            closable
            @click:close="deleteTag(tag.id, tag.model)"
          >
            {{ capitaliseText(tag.label) }}
          </v-chip>
        </div>
        <!-- end of tags list -->
        <v-text-field
          id="searchString"
          v-model="searchString"
          append-inner-icon="fa fa-search"
          label="Search names and synonyms"
          variant="outlined"
          clearable
          clear-icon="fa fa-times-circle"
          hide-details
          class="pt-1 mr-10"
          color="primary"
          @click:clear="clearResults"
        />
        <v-data-table
          v-if="tags.length > 0 && searchString && searchString.length > 0"
          v-model="recordTags"
          v-model:search-input="searchString"
          :headers="tagHeaders"
          :items="tags"
          :items-per-page="10"
          :footer-props="{ 'items-per-page-options': [10, 20, 30, 40, 50] }"
          item-key="label"
          class="elevation-1 mr-10"
          show-select
          calculate-widths
          mobile-breakpoint="900"
          return-object
        >
          <template #[`item.model`]="{ item }">
            <div :class="'text-' + colors[item.model]" class="noBreak">
              {{ item.model.toUpperCase().replace(/_/g, " ") }}
            </div>
          </template>
          <template #[`item.label`]="{ item }">
            <v-chip
              :class="colors[item.model] + 'text-white noBreak'"
              :color="colors[item.model]"
              variant="flat"
            >
              {{ capitaliseText(item.label, item.model) }}
            </v-chip>
          </template>
          <template #[`item.synonyms`]="{ item }">
            <div v-if="item.synonyms" class="font-italic limitWidth">
              {{ item.synonyms.join(", ") }}
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <!-- end of tags -->
    <!-- policy query -->
    <v-row v-if="hasPolicyQuery">
      <v-col cols="12" class="ml-4">
        <!-- A list here of selected standards is shown just above the text box -->
        <div class="pl-2">
          <v-chip
            v-for="pol in foundPolicies"
            :key="pol.name"
            class="ma-2"
            close-icon="fa fa-trash"
            closable
            @click:close="deletePolicy(pol.id)"
          >
            {{ pol.abbreviation || pol.name }}
          </v-chip>
        </div>
        <!-- end of standard list -->
        <v-text-field
          id="searchString"
          v-model="searchString"
          append-inner-icon="fa fa-search"
          label="Search policies"
          variant="outlined"
          clearable
          clear-icon="fa fa-times-circle"
          hide-details
          class="pt-1 mr-10"
          color="primary"
          @click:clear="clearResults"
        />
        <!-- drop-down table for searchResults to go here -->
        <v-data-table
          v-if="searchResults.length > 0 && searchString && searchString.length > 0"
          v-model="foundPolicies"
          v-model:search-input="searchString"
          :headers="headers"
          :items="searchResults"
          :items-per-page="10"
          :footer-props="{ 'items-per-page-options': [10, 20, 30, 40, 50] }"
          item-key="id"
          class="elevation-1 mr-10"
          calculate-widths
          mobile-breakpoint="900"
          return-object
        >
          <template #[`item.name`]="{ item }">
            <div v-if="item.name">
              <v-checkbox
                @click="itemSelected(item)"
              >
              <template #label>
                <span class="pl-2">{{item.name}}</span>
              </template>
              </v-checkbox>
            </div>
          </template>
          <template #[`item.abbreviation`]="{ item }">
            <div v-if="item.abbreviation">
              {{ item.abbreviation }}
            </div>
          </template>
        </v-data-table>
        <!-- end of temp results data table -->
      </v-col>
    </v-row>
    <!-- end of policy query -->
    <!-- question options -->
    <v-row class="align-stretch justify-center fill-height">
      <v-col v-for="item in questions" :key="item.id" cols="3">
        <v-card
          class="full-width d-flex align-center text-center flex-column questionCard justify-center"
          height="130"
          elevation="4"
          :color="item.color"
          :class="[
            {
              'cardXtraSmall pa-0': $vuetify.display.xsOnly,
              'cardSmall pa-2': $vuetify.display.smOnly,
              'cardMedium pa-2': $vuetify.display.mdAndUp,
              'cardLarge pa-4': $vuetify.display.lgAndUp,
              'cardXtraLarge pa-4': $vuetify.display.xlOnly,
            },
          ]"
          @click="
            processLink(
              item.link,
              item.query,
              item.message,
              item.refined,
              item.breadcrumbMod,
              item.role,
              item.restrict,
            )
          "
        >
          <div class="d-flex align-center">
            <v-card-text
              class="text-white font-weight-medium text-xl-h4 text-lg-h5 text-md-h5 text-sm-h5 text-xs-h5 questionText"
            >
              <span>
                {{ item.question }}
              </span>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- question footer -->
    <v-row>
      <v-col cols="12">
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <p style="text-align: center" v-html="footer" />
        <!-- eslint-enable vue/no-v-html -->
      </v-col>
    </v-row>
    <!-- Potentially annoy the user by stopping to ask if they want to carry on due to few results -->
    <v-dialog v-model="lowResultsStoppage" persistent>
      <v-card>
        <v-card-title class="text-h5">
          Fewer than 10 {{ getCurrentRegistry }} records fit your criteria?
        </v-card-title>
        <v-card-text>
          How would you like to proceed? Select "dismiss" to retry your
          selection. Or, you may go to the results.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-darken-1"
            variant="text"
            persistent
            @click="
              lowResultsStoppage = false;
              iDontCare = true;
            "
          >
            Dismiss
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            persistent
            @click="goToResults"
          >
            View results
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import questionSets from "@/data/questionPageData.json";
import { mapActions, mapGetters } from "vuex";
import Loaders from "@/components/Loaders/Loaders.vue";
import multiTagFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilterBrief.json";
import GraphClient from "@/lib/GraphClient/GraphClient";
import tagsQuery from "@/lib/GraphClient/queries/geTags.json";
import parentsQuery from "@/lib/GraphClient/queries/getParentPolicies.json";
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue";
import ResultPreviewBanner from "@/components/Results/ResultPreviewBanner.vue";
import { xorBy } from 'lodash'

const graphClient = new GraphClient();

/*
 * searchQuery is a query that will be used for getting additional info., e.g. models/formats, which will constrain
 * the user's search to some special case. It will be used to create a text search box on the page when the questions
 * are loaded.
 * searchString is whatever search term is to be passed to the searchQuery.
 * query is simply some params which must be passed to the multiTagFilter when the question is clicked upon.
 */

export default {
  name: "QuestionPage",
  components: { ResultPreviewBanner, Loaders, Breadcrumbs },
  mixins: [stringUtils],
  data: () => {
    return {
      clear: false,
      watchRecordTags: true,
      questions: {},
      searchQuery: {},
      hasModelFormatQuery: false,
      hasTagsQuery: false,
      hasPolicyQuery: false,
      searchString: null,
      searchResults: [],
      recordTags: [],
      tags: [],
      loading: false,
      foundModelFormats: [],
      foundPolicies: [],
      title: "",
      footer: "",
      lowResultsStoppage: false,
      iDontCare: false,
      currentBreadcrumb: null,
      restrict: null,
      // This is silly, but I was in a rush and had enough with fighting javascript;
      registrySwitch: {
        database: "Database",
        policy: "Policy",
        standard: "Standard",
        collection: "Collection",
      },
      headers: [
        {
          title: "Name",
          sortable: false,
          value: "name",
        },
        {
          title: "Abbreviation",
          sortable: false,
          value: "abbreviation",
        },
      ],
      tagHeaders: [
        {
          title: "Type of keyword",
          sortable: false,
          value: "model",
        },
        {
          title: "Name",
          sortable: false,
          value: "label",
        },
        {
          title: "Definition",
          sortable: false,
          value: "definitions[0]",
          filterable: false,
        },
        {
          title: "Alternative names",
          sortable: false,
          value: "synonyms",
        },
      ],
      colors: {
        domain: "domain_color",
        taxonomy: "taxonomic_color",
        subject: "subject_color",
        user_defined_tag: "tags_color",
      },
    };
  },
  computed: {
    ...mapGetters("multiTagsStore", [
      "getFairSharingRecords",
      "getCurrentRegistry",
      "getQueryParams",
      "getSelectedTags",
    ]),
    ...mapGetters("navigationStore", ["getRouteQuery", "getPreviousLocation"]),
  },
  watch: {
    $route() {
      this.getQuestions();
    },
    getFairSharingRecords() {
      if (
        this.getFairSharingRecords.length > 0 &&
        this.getFairSharingRecords.length <= 10 &&
        !this.iDontCare &&
        !this.loading
      ) {
        this.lowResultsStoppage = true;
      }
    },
    async searchString(val) {
      if (!val || val.length < 3) {
        return;
      }
      this.searchResults = [];
      val = val.trim();
      await this.getResults(val);
    },
    // Running the query every time user selects a new subject, domain etc.
    async recordTags(val) {
      let _module = this;
      if (!_module.watchRecordTags) {
        return;
      }
      _module.loading = true;

      let queryParam = _module.generateQuery(val);
      await _module.fetchMultiTagData(queryParam);
      // TODO: Handle errors from the server.
      _module.recordsFound = _module.getFairSharingRecords;
      _module.$store.commit("multiTagsStore/setQueryParams", queryParam);
      _module.$store.commit("multiTagsStore/setSelectedTags", val);
      _module.loading = false;
    },
    // Running the query every time user selects a new model/format
    async foundModelFormats(val) {
      let _module = this;
      _module.loading = true;
      let ids = [];
      let names = [];
      val.forEach(function (format) {
        ids.push(format.id);
        names.push(format.name);
      });
      let query = _module.getQueryParams;
      if (ids.length > 0) {
        query.dataFormatsAndTerminologies = ids;
      }
      else {
        delete query.dataFormatsAndTerminologies;
      }
      this.$store.commit(
        "navigationStore/setComplianceState",
        names.join(", "),
      );
      await this.fetchMultiTagData(query);
      _module.loading = false;
    },
    async foundPolicies(val) {
      let _module = this;
      _module.loading = true;
      let ids = [];
      let names = [];
      val.forEach(function (format) {
        ids.push(format.id);
        names.push(format.name);
      });
      let query = _module.getQueryParams;
      if (ids.length > 0) {
        query.policyRecommendations = ids;
      }
      else {
        delete query.policyRecommendations;
      }
      this.$store.commit(
        "navigationStore/setPolicyComplianceState",
        names.join(", "),
      );
      await this.fetchMultiTagData(query);
      _module.loading = false;
    },
  },
  mounted() {
    let _module = this;
    _module.getQuestions();
  },
  methods: {
    ...mapActions("multiTagsStore", ["fetchMultiTagData", "resetMultiTags"]),
    /*
     * This is what's executed when the user arrives at a new question.
     */
    async getQuestions() {
      this.searchString = null;
      let questionData = questionSets.questionSets.find(
        (q) => parseInt(q["path"]) === parseInt(this.$route.params.id),
      );
      this.currentBreadcrumb = JSON.parse(
        JSON.stringify(questionData.breadcrumb),
      );

      this.questions = JSON.parse(JSON.stringify(questionData.questions));
      this.searchQuery = questionData.searchQuery;
      this.hasModelFormatQuery = questionData.hasModelFormatQuery;
      this.hasTagsQuery = questionData.hasTagsQuery;
      this.hasPolicyQuery = questionData.hasPolicyQuery; // TODO: The work related to this is in progress

      // The current page isn't a link, only previous pages.
      this.title = questionData.title;
      this.footer = questionData.footer;
      if (questionData.clear) {
        this.clear = true;
        this.$store.commit(
          "navigationStore/clearPreviousNavigation",
          `/${this.$route.params.id}`,
        );
        this.$store.commit(
          "navigationStore/sliceBreadcrumb",
          `/${this.$route.params.id}`,
        );
        this.foundPolicies = [];
        this.foundModelFormats = [];
        /* v8 ignore start */
      }
      else {
        this.clear = false;
      }
      /* v8 ignore stop */
      // If they're arriving somewhere where a previous query is defined it should be retrieved from the store.
      // BUT: To prevent users complaining the result is "wrong", the query has to be pushed to the next question in
      // line when leaving, rather than the current one. So, when arriving at a question it will already have a
      // previous query set and it needs to be triggered only if going backwards (or each query will be run twice
      // when advancing through the questions).
      let previousQuery;
      let _module = this;
      try {
        previousQuery = JSON.parse(
          JSON.stringify(this.getRouteQuery[this.$route.params.id]),
        );
      }
      catch {
        // Fails on initial screen because getRouteQuery hasn't been defined.
        previousQuery = {};
      }

      // Sometimes the previous location could be something like "/refine"
      let previousLocation = Number.parseInt(
        this.getPreviousLocation.replace("/", ""),
      );
      // We're coming from results, refinement or whatever, that is named rather than numbered
      if (isNaN(previousLocation)) {
        previousLocation = 9999;
      }
      let currentLocation = Number.parseInt(this.$route.params.id);
      let prevLength = Number.parseInt(Object.keys(previousQuery).length);
      // This is because the previous query needs only to be loaded when going backwards.
      if (prevLength > 0 && previousLocation > currentLocation) {
        // Set up the selected tags. The store should be checked only if some were defined in the query.
        // If none are in the query then the store must be cleared (see 'else').
        _module.watchRecordTags = false;
        if (
          "subjects" in previousQuery ||
          "domains" in previousQuery ||
          "userDefinedTags" in previousQuery ||
          "taxonomies" in previousQuery
        ) {
          if (_module.getSelectedTags) {
            _module.getSelectedTags.forEach(function (tag) {
              if (
                _module.recordTags.filter((x) => x.label === tag.label)
                  .length === 0
              ) {
                _module.recordTags.push(tag);
              }
            });
          }
          // Should tags be cleared here (as in the else, below) also?
        }
        else {
          _module.$store.commit("multiTagsStore/setSelectedTags", []);
          _module.recordTags = [];
        }
        if ("dataFormatsAndTerminologies" in previousQuery) {
          // TODO: Is any setup even necessary here?
        }
        else {
          _module.$store.commit("navigationStore/setComplianceState", []);
          _module.foundModelFormats = [];
        }

        // Load the previous query.
        _module.$store.commit("multiTagsStore/setQueryParams", previousQuery);
        _module.loading = true;
        await _module.fetchMultiTagData(previousQuery);
        _module.loading = false;

        // We should be going backwards at this point
        // TODO: Find queries in the routeQuery store further advanced than the current click target, and clear them.
        // TODO: This could probably go in the store.
        _module.watchRecordTags = true;
        this.$store.commit(
          "navigationStore/clearPreviousNavigation",
          currentLocation,
        );
      }
      else if (previousLocation > currentLocation) {
        // Empty query, so results should be cleared, but only whilst going backwards.
        this.resetMultiTags();
      }
      // At this point the user is going _forwards_ but there still might be tags hanging around because they've
      //  jumped backwards past e.g. a subject/domain selector and then forward again!
      else {
        if (
          "subjects" in this.getQueryParams ||
          "domains" in this.getQueryParams ||
          "userDefinedTags" in this.getQueryParams ||
          "taxonomies" in this.getQueryParams
        ) {
          if (_module.getSelectedTags) {
            _module.getSelectedTags.forEach(function (tag) {
              if (
                _module.recordTags.filter((x) => x.label === tag.label)
                  .length === 0
              ) {
                _module.recordTags.push(tag);
              }
            });
          }
        }
        else {
          _module.recordTags = [];
        }
      }
    },
    /*
     * This code is executed when a user clicks on a question.
     */
    async processLink(
      link,
      query,
      message,
      refined,
      breadcrumbMod,
      role,
      restrict,
    ) {
      if (restrict) {
        this.$store.commit("navigationStore/setRestrict", restrict);
      }

      // Always stash the breadcrumb.
      // Some questions have a query that must be run when the question is clicked.
      if (!(Object.keys(query).length === 0)) {
        this.loading = true;
        // There may be some additional parameters set as a result of the user having made a special selection
        // on this page, e.g. when searching for models/formats.
        if (this.foundModelFormats.length > 0) {
          let ids = [];
          let names = [];
          this.foundModelFormats.forEach(function (format) {
            ids.push(format.id);
            names.push(format.name);
          });
          query["dataFormatsAndTerminologies"] = ids;
          this.$store.commit(
            "navigationStore/setComplianceState",
            names.join(", "),
          );
        }
        if (this.foundPolicies.length > 0) {
          let ids = [];
          let names = [];
          this.foundPolicies.forEach(function (format) {
            ids.push(format.id);
            names.push(format.name);
          });
          query["policyRecommendations"] = ids;
          this.$store.commit(
            "navigationStore/setPolicyComplianceState",
            names.join(", "),
          );
        }
        // Merge the previous query in case we're coming from a page where data have already been calculated.
        let existingQueryCopy = JSON.parse(JSON.stringify(this.getQueryParams));
        let mergedQuery = { ...existingQueryCopy, ...query };
        await this.fetchMultiTagData(mergedQuery);
        this.$store.commit("multiTagsStore/setQueryParams", mergedQuery);
        if (refined) {
          this.$store.commit("multiTagsStore/setRefinedStatus", refined);
        }
        if (message) {
          this.$store.commit("multiTagsStore/setSelectionMessage", message);
        }
        this.loading = false;
      }

      // Make the user go through this again if they got a low number of hits.
      if (this.lowResultsStoppage && !this.iDontCare) {
        return;
      }

      // Save where we've just been.
      let path = "/" + this.$route.params.id;
      this.$store.commit("navigationStore/setNavigationState", path);

      if (role) {
        this.$store.commit("navigationStore/setRole", role);
      }

      // Before leaving the page, stash the query for this particular page.
      // In some cases a question may need to execute a query on leaving, but clear the results of that on returning,
      // e.g. a researcher depositing data.
      let queryCopy = JSON.parse(JSON.stringify(this.getQueryParams));
      let nextId = link.replace("/", "");
      this.$store.commit("navigationStore/setRouteQuery", [nextId, queryCopy]);
      // And set up the breadcrumbs correctly
      if (breadcrumbMod) {
        this.currentBreadcrumb.text =
          this.currentBreadcrumb.text + breadcrumbMod;
      }
      if (this.currentBreadcrumb.text !== "Finished!") {
        this.$store.commit(
          "navigationStore/addBreadcrumb",
          this.currentBreadcrumb,
        );
      }
      // Now the links.
      // In this case, the link is to an external site.
      /* v8 ignore start */
      if (link.match(/^http/)) {
        window.open(link);
      }
      /* v8 ignore stop */

      // Whereas here, it's linking to somewhere else within the assistant.
      else {
        this.$router.push({ path: link });
      }
    },
    async getResults(queryString) {
      // A different query is run depending on whether hasTagsQuery or hasModelFormatQuery is true.
      let _module = this;
      if (_module.hasModelFormatQuery || _module.hasPolicyQuery) {
        let queryCopy = JSON.parse(JSON.stringify(this.searchQuery));
        let filterCopy = JSON.parse(JSON.stringify(multiTagFilter));
        if (queryString) {
          queryCopy["q"] = queryString;
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
        if (queryString) tagQueryCopy.queryParam = { q: queryString };
        let taggedRecords = this.getFairSharingRecords.map((x) => x.id);
        if (taggedRecords.length) {
          tagQueryCopy.queryParam.taggedRecords = taggedRecords;
        }
        else {
          delete tagQueryCopy.taggedRecords;
        }
        let tags = await graphClient.executeQuery(tagQueryCopy);
        if (!tags.error) {
          // This is to take the parents of each tag up a level, so they are included
          // in the list of available tags from which users may select.
          let parents = [];
          tags = tags.searchTags;
          tags.forEach((tag) => {
            tag.parents.forEach((parent) => {
              if (
                _module.tags.filter((x) => x.label === parent.label).length ===
                0
              ) {
                parent.model = tag.model;
                parents.push(parent);
              }
            });
            delete tag.parents;
          });
          // TODO: process here to handle nested parents.
          _module.tags = tags.concat(parents);
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
      let domains = val.filter((x) => x.model === "domain").map((x) => x.label);
      if (domains.length) {
        query["domains"] = domains;
      }
      let subjects = val
        .filter((x) => x.model === "subject")
        .map((x) => x.label);
      if (subjects.length) {
        query["subjects"] = subjects;
      }
      let taxonomies = val
        .filter((x) => x.model === "taxonomy")
        .map((x) => x.label);
      if (taxonomies.length) {
        query["taxonomies"] = taxonomies;
      }
      let user_defined_tags = val
        .filter((x) => x.model === "user_defined_tag")
        .map((x) => x.label);
      if (user_defined_tags.length) {
        query["userDefinedTags"] = user_defined_tags;
      }
      return query;
    },
    deleteTag(tagId, tagModel) {
      let currentTags = [];
      let tagFilter = tagId + tagModel;
      this.recordTags.forEach(function (tag) {
        let identifier = tag.id + tag.model;
        if (identifier !== tagFilter) {
          currentTags.push(tag);
        }
      });
      this.recordTags = currentTags;
    },
    deleteStandard(standardId) {
      this.foundModelFormats = this.foundModelFormats.filter(
        (el) => el.id !== standardId,
      );
    },
    deletePolicy(policyId) {
      this.foundPolicies = this.foundPolicies.filter(
        (el) => el.id !== policyId,
      );
    },
    goToResults() {
      this.$store.commit(
        "navigationStore/addBreadcrumb",
        this.currentBreadcrumb,
      );
      this.$router.push("/results");
    },
    /**
     * Method to fetch all the parents till the last found parent (id, name, abbreviation) traversing bottom to top of the selected policy
     * @param item - Selected policy
     * @return {Promise<void>} - Add the parents if not already present to foundPolicies array
     */
    async itemSelected(item) {
      let _module = this;
      parentsQuery.queryParam = { id: item.id };
      let parents = await graphClient.executeQuery(parentsQuery);
      parents["fairsharingRecord"]["parentPolicies"].forEach((parent) => {
        if (!_module.foundPolicies.map((x) => x.id).includes(parent.id)) {
          _module.foundPolicies.push(parent);
        }
      });
      _module.foundPolicies = xorBy(_module.foundPolicies,[item], (item) => item)
    },
  },
};
</script>

<style scoped lang="scss">
.wrapperClass {
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
    from {
      bottom: -300%;
      opacity: 0;
    }
    to {
      bottom: 20px;
      opacity: 1;
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
.cardLarge,
.cardXtraLarge {
  min-height: 100px;
  padding: 50px;
}
</style>
