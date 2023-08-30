<template>
  <div>
    <v-fade-transition v-if="recordsLoading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <v-expand-transition class="ma-5">
      <v-container
        fluid
        class="py-0"
      >
        <v-row
          justify="center"
          no-gutters
        >
          <v-col cols="12">
            <p
              class="pt-6"
            >
              Use this search box to find tags of interest.
            </p>
            <v-text-field
              id="searchString"
              v-model="searchString"
              append-icon="fa-search"
              label="Search names and synonyms"
              outlined
              clearable
              clear-icon="fa-times-circle"
              :clear-cb="tagsLoading = false"
              hide-details
              class="pt-1"
            />
            <v-data-table
              v-model="recordTags"
              :headers="headers"
              :items="tags"
              :items-per-page="10"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
              item-key="label"
              class="elevation-1"
              show-select
              calculate-widths
              mobile-breakpoint="900"
              :loading="tagsLoading"
              loading-text="Please wait, tags are loading"
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
      </v-container>
    </v-expand-transition>
  </div>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import tagsQuery from "@/lib/GraphClient/queries/geTags.json";
import GraphClient from "@/lib/GraphClient/GraphClient";
import {mapActions, mapGetters} from "vuex";
import Loaders from "@/components/Loaders/Loaders.vue";

const graphClient = new GraphClient();
export default {
  name: 'SearchTags',
  components: { Loaders },
  mixins: [stringUtils],
  data() {
    return {
      recordsLoading: false,
      justMounted: true,
      searchString: null,
      tagsLoading: false,
      headers: [
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
      tags: [],
      colors: {
        domain: 'domain_color',
        taxonomy: 'taxonomic_color',
        subject: 'subject_color',
        user_defined_tag: 'tags_color'
      },
      recordTags: []
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getQueryParams", "getSelectedTags"
    ])
  },
  watch: {
    getSelectedTags: {
      handler(newValue) {
        this.recordTags = newValue;
      },
    },
    async recordTags (val) {
      let _module = this;
      // It's necessary to modify tags to reflect the store.
      // We can't have tags modifying the store whilst this happens.
      if (_module.justMounted) {
        return;
      }
      // TODO: here's where to trigger the multiTagFilter.
      // first, generate MULTI_TAGS.query param, then run the query and generate recordsCount and recordsFound.

      _module.recordsLoading = true;
      // TODO: refactor this for brevity

      // TODO: Bug is here; it doesn't check the store before modifying the query.
      let queryParam =  _module.generateQuery(val)[0];
      let run = _module.generateQuery(val)[1];
      if (run) {
        //let response = await graphClient.executeQuery(MULTI_TAGS);
        await _module.fetchMultiTagData(queryParam);
        // TODO: Handle errors from the server.
        _module.recordsFound = _module.getFairSharingRecords;
        _module.$store.commit('multiTagsStore/setQueryParams', queryParam);
        _module.$store.commit('multiTagsStore/setSelectedTags', val);
        _module.recordsLoading = false;
      }
      else {
        _module.$store.commit('multiTagsStore/setSelectedTags', val);
        _module.recordsLoading = false;
      }
    },
    async searchString(val){
      this.tagsLoading = true;
      this.tags = [];
      val = val.trim();
      await this.getTags(val);
      this.tagsLoading = false;
    },
  },
  mounted() {
    let _module = this;
    // TODO: Make sure that _module.tags matches the store
    if (_module.getSelectedTags) { // TODO: Because the store is broken in EditTags.spec.js
      _module.getSelectedTags.forEach(function(tag) {
        _module.recordTags.push(tag);
      })
      _module.justMounted = false;
    }
  },
  methods:{
    ...mapActions('multiTagsStore', ['fetchMultiTagData', 'resetMultiTags']),
    async getTags(queryString) {
      let tagQueryCopy = JSON.parse(JSON.stringify(tagsQuery));
      if (queryString) tagQueryCopy.queryParam = {q: queryString};
      let tags = await graphClient.executeQuery(tagQueryCopy);
      if (!tags.error) {
        this.tags = tags.searchTags;
      }
    },
    // This generates query parameters for the multi_tag_filter
    generateQuery(val) {
      let run = false;
      let query = this.getQueryParams;
      let domains = val.filter(x => x.model === 'domain').map(x => x.label);
      if (domains.length) {
        query['domains'] = domains;
        run = true;
      }
      let subjects = val.filter(x => x.model === 'subject').map(x => x.label);
      if (subjects.length) {
        query['subjects'] = subjects;
        run = true;
      }
      let taxonomies = val.filter(x => x.model === 'taxonomy').map(x => x.label);
      if (taxonomies.length) {
        query['taxonomies'] = taxonomies;
        run = true;
      }
      let user_defined_tags = val.filter(x => x.model === 'user_defined_tag').map(x => x.label);
      if (user_defined_tags.length) {
        query['userDefinedTags'] = user_defined_tags;
        run = true;
      }
      return [query, run]
    },
    selectSubjectAgnostic() {
      let _module = this;
      //find the relevant entry in tags and insert it into recordTags
      const agnostic = _module.tags.find((element) => element.label === 'subject agnostic');
      _module.recordTags.push(agnostic);
      // searchString
      //Vue.set(this.searchString, 'subject agnostic');
      _module.searchString = 'subject agnostic';
    }
  }
}

</script>

<style scoped>
table#tagsTable {
    border-collapse: collapse;
    width: 100%
}

table#tagsTable td.titleCell {
    width: 100px;
    white-space: nowrap;
    text-align: center;
    font-size: 16px;
    font-weight: bolder;
    height: 55px;
}

table#tagsTable tr {
    border-collapse: collapse;
    border-bottom: 10px solid white;
}

.elevation-1 >>> .v-data-table-header-mobile__select {
    justify-content: flex-end;
    width: 100%;
}


</style>