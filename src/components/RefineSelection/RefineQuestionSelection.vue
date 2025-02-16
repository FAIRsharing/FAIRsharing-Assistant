<template>
  <v-container
    fluid
    class="wrapperClass d-flex flex-column align-content-stretch"
  >
    <v-fade-transition v-if="loading">
      <div>
        <v-overlay
          :model-value="loading"
          class="align-center justify-center"
          :absolute="false"
          opacity="0.8"
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
    <!-- tags query -->
    <p class="mt-5 pa-5">
      The filters below will allow you to further refine the type of record
      you're looking for. Hover over the tooltip question mark on each one to
      see more information about that field. Additionally, you can add/remove
      subject (and other) tags at this stage. If you prefer, you could return to
      an earlier stage of the questions by clicking on the relevant part of the
      breadcrumb trail above.
    </p>
    <v-row>
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
            <div :class="colors[item.model] + '--text'" class="noBreak">
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
    <AddOnFilters
      @filter-source="
        capitaliseText(getQueryParams['fairsharingRegistry'][0], null)
      "
    />
    <v-col cols="6" class="ml-4">
      <v-btn color="primary" @click="goToResults"> View Results </v-btn>
    </v-col>
  </v-container>
</template>

<script>
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue";
import Loaders from "@/components/Loaders/Loaders.vue";
import ResultPreviewBanner from "@/components/Results/ResultPreviewBanner.vue";
import stringUtils from "@/utils/stringUtils";
import { mapActions, mapGetters } from "vuex";
import tagsQuery from "@/lib/GraphClient/queries/geTags.json";
import GraphClient from "@/lib/GraphClient/GraphClient";
import AddOnFilters from "@/components/Others/AddOnFilters.vue";

const graphClient = new GraphClient();

export default {
  name: "RefineQuestionSelection",
  components: { AddOnFilters, ResultPreviewBanner, Loaders, Breadcrumbs },
  mixins: [stringUtils],
  data: () => {
    return {
      mounted: false,
      loading: false,
      recordTags: [],
      tags: [],
      searchString: null,
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
  },
  watch: {
    /* v8 ignore start */
    async searchString(val) {
      if (!val || val.length < 3) {
        return;
      }
      this.searchResults = [];
      val = val.trim();
      await this.getResults(val);
      /* v8 ignore stop */
    },
    async recordTags(val) {
      let _module = this;
      if (_module.mounted) {
        _module.loading = true;
        let queryParam = _module.generateQuery(val);
        await _module.fetchMultiTagData(queryParam);
        // TODO: Handle errors from the server.
        _module.recordsFound = _module.getFairSharingRecords;
        _module.$store.commit("multiTagsStore/setQueryParams", queryParam);
        _module.$store.commit("multiTagsStore/setSelectedTags", val);
        _module.loading = false;
      }
    },
  },
  mounted() {
    let _module = this;
    _module.mounted = false;
    _module.getSelectedTags.forEach(function (tag) {
      _module.recordTags.push(tag);
    });
    _module.mounted = true;
  },
  methods: {
    ...mapActions("multiTagsStore", ["fetchMultiTagData", "resetMultiTags"]),
    /* v8 ignore start */
    async getResults(queryString) {
      let _module = this;
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
            parent.model = tag.model;
            parents.push(parent);
          });
          delete tag.parents;
        });
        // TODO: process here to handle nested parents.
        _module.tags = tags.concat(parents);
      }
    },
    /* v8 ignore stop */
    clearResults() {
      this.loading = false;
      this.tags = [];
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
    /* v8 ignore start */
    goToResults() {
      let _module = this;
      // Here's the basic breadcrumb...
      let breadcrumb = {
        id: "refine_crumb",
        text: "Refine your choice",
        link: "/refine",
      };
      // ...now add too many textual elements to it!
      let extra_text = [];
      Object.keys(this.getQueryParams).forEach(function (key) {
        if (
          !(
            [
              "fairsharingRegistry",
              "subjects",
              "domains",
              "taxonomies",
              "userDefinedTags",
            ].indexOf(key) > -1
          )
        ) {
          extra_text.push(_module.humaniseKey(key));
        }
      });
      if (extra_text.length > 0) {
        breadcrumb.text = `Refine your choice: <b>${extra_text.join(", ")}</b>`;
      }
      // Finally, go to the result, pushing this outrageous breadcrumb as we go.
      this.$store.commit("navigationStore/addBreadcrumb", breadcrumb);
      this.$router.push("/results");
    },
    /* v8 ignore end */
  },
};
</script>

<style></style>
