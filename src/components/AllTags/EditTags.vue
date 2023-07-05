<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-fade-transition v-if="recordsLoading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <v-form
      id="editTags"
      ref="editTags"
      v-model="formValid"
    >
      <v-container fluid>
        <v-row>
          <p>Placeholder for total count of records: {{ recordsCount }}</p>
        </v-row>
        <v-row>
          <p> 
            <v-btn
              :disabled="!resultsButtonActive"
              color="blue white--text"
              @click="showResults()"
            >
              View results
            </v-btn>
          </p>
        </v-row>
        <v-row>
          <table id="tagsTable">
            <tbody>
              <tr
                v-for="(section, sectionName, sectionIndex) in sections"
                :key="'edit_keywords_' + sectionIndex"
                class="mb-3"
              >
                <td
                  class="white--text py-2 px-4 titleCell"
                  :class="section.color"
                >
                  <!--
                <v-tooltip right>
                  <template #activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      small
                      class="white--text mr-1"
                      v-on="on"
                    >
                      fa-question-circle
                    </v-icon>
                  </template>
                  <span> {{ section.tooltip }} </span>
                </v-tooltip>
                -->
                  {{ sectionName.toUpperCase() }}
                </td>
                <td :class="section.color + ' lighten-2'">
                  <v-chip-group
                    class="pl-2"
                    column
                  >
                    <v-chip
                      v-for="(tag, tagIndex) in recordTags.filter(x => x.model === section.label)"
                      :key="'section_' + sectionIndex + '_tag_' + tagIndex"
                      :class="[section.color + '--text white']"
                    >
                      {{ capitaliseText(tag.label, tag.model) }}
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            small
                            class="ml-1"
                            :class="[section.color + '--text white']"
                            v-on="on"
                            @click="removeTag(tag.id)"
                          >
                            fa-times-circle
                          </v-icon>
                        </template>
                        <span> Remove term </span>
                      </v-tooltip>
                    </v-chip>
                  </v-chip-group>
                </td>
              </tr>
            </tbody>
          </table>
        </v-row>
      </v-container>

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
              <v-text-field
                id="searchString"
                v-model="searchString"
                append-icon="fa-search"
                label="Search names and synonyms"
                outlined
                hide-details
                class="pt-10"
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
    </v-form>
  </div>
</template>

<script>
//import { mapGetters, mapActions } from "vuex"
//import { mapGetters, mapState, mapActions } from "vuex"
//import KeywordTooltip from "@/components/Records/Shared/KeywordTooltip.vue";
import tagsQuery from "@/lib/GraphClient/queries/geTags.json"
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import Loaders from "@/components/Loaders/Loaders.vue";
import {ResultView} from "@/router/routes";
import multiTagsFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";
const graphClient = new GraphClient();
const MULTI_TAGS = JSON.parse(JSON.stringify(multiTagsFilter));
MULTI_TAGS.queryParam = {};

export default {
  name: "EditTags",
  //components: {KeywordTooltip},
  components: { Loaders },
  mixins: [],
  data(){
    return {
      formValid: true,
      resultsButtonActive: false,
      recordsCount: {
        Database: 0,
        Standard: 0,
        Policy: 0,
        Collection: 0
      },
      recordsFound: [],
      menu: {
        content: null,
        label: "Edit record's tags"
      },
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
      searchString: null,
      initialized: false,
      showTypes: {
        domain: true,
        taxonomy: true,
        subject: true,
        user_defined_tag: true
      },
      tags: [],
      recordTags: [],
      tagsLoading: false,
      recordsLoading: false,
      showAddTagOverlay: false,
      colors: {
        domain: 'brown',
        taxonomy: 'blue',
        subject: 'orange',
        user_defined_tag: 'grey'
      },
      selectedTags: {
        domains: [],
        taxonomies: [],
        subjects: [],
        user_defined_tags: []
      },
    }
  },
  computed: {
    //...mapGetters("record", ["getSection"]),
    //...mapState("editor", ["tooltips", "colors"]),
    //...mapGetters("editor", ["getPartialTags"]),
    //...mapState("record", ["sections"]),
    sections() {
      return {
        "taxonomic range": {
          items: [],
          color: this.colors["taxonomy"],
          //tooltip: this.tooltips.species
          tooltip: 'This should still be called Taxonomy',
          label: 'taxonomy'
        },
        subjects: {
          items: [],
          color: this.colors["subject"],
          //tooltip: this.tooltips.subjects
          tooltip: "Subjects",
          label: 'subject'
        },
        domains: {
          items: [],
          color: this.colors["domain"],
          //tooltip: this.tooltips.domains
          tooltip: "Domains",
          label: 'domain'
        },
        "user defined tags": {
          items: [],
          color: this.colors["user_defined_tag"],
          //tooltip: this.tooltips.userDefinedTags
          tooltip: "User defined tags",
          label: 'user_defined_tag'
        },
      }
    },
  },
  watch: {
    recordsCount: {
      handler(val) {
        let _module = this;
        let count = Object.values(val).reduce((partialSum, a) => partialSum + a, 0);
        if (count > 0) {
          _module.resultsButtonActive = true;
          return;
        }
        _module.resultsButtonActive = false;
      },
      deep: true
    },
    buttonLabel(){
      if (this.menu.show) return "Hide table";
      return "Add new term(s)";
    },
    buttonIcon(){
      if (this.menu.show) return "fa-minus-circle";
      return "fa-plus-circle";
    },
    async searchString(val){
      this.tagsLoading = true;
      this.tags = [];
      val = val.trim();
      await this.getTags(val);
      this.tagsLoading = false;
    },
    recordTags: async function (val) {
      let _module = this;
      // TODO: here's where to trigger the multiTagFilter.
      // first, generate MULTI_TAGS.query param, then run the query and generate recordsCount and recordsFound.
      console.log(JSON.stringify(val));
      //v-for="(tag, tagIndex) in recordTags.filter(x => x.model === section.label)"
      _module.recordsLoading = true;
      // TODO: refactor this for brevity
      MULTI_TAGS.queryParam = _module.generateQuery(val)[0];
      let run = _module.generateQuery(val)[1];
      if (run) {
        let response = await graphClient.executeQuery(MULTI_TAGS);
        // TODO: Handle errors from the server.
        if (!response.error) {
          _module.recordsFound = response['multiTagFilter'];
          _module.recordsFound.forEach(function(record) {
            _module.recordsCount[record.registry] += 1;
          })
        }
        else {
          _module.error = true;
        }
      }
      else {
        _module.recordsCount = {
          Database: 0,
          Standard: 0,
          Policy: 0,
          Collection: 0
        }
      }
      _module.recordsLoading = false;
    }
  },
  /*
  mounted(){
    this.$nextTick(async function () {
      this.loading = true;
      this.initialized = false;
      this.loading = false;
      this.initialized = true;
    })
  },
   */
  methods: {
    //...mapActions('editor', ["getTags"]),
    /*
    showMenu(){
      if (!this.menu.show) { this.$scrollTo("#editTags") }
      this.menu.show = !this.menu.show;
    },
     */
    async getTags(queryString) {
      let tagQueryCopy = JSON.parse(JSON.stringify(tagsQuery));
      if (queryString) tagQueryCopy.queryParam = {q: queryString};
      let tags = await graphClient.executeQuery(tagQueryCopy);
      if (!tags.error) {
        this.tags = tags.searchTags;
      }
    },
    removeTag(id){
      this.recordTags = this.recordTags.filter(el => el.id !== id);
    },
    capitaliseText(text, type) {
      if (type === 'taxonomy') {
        // Upper case for first character only.
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      }
      else {
        // Upper case for first letter of each word.
        return text.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
      }
    },
    showResults() {
      // TODO: Re-direct to ResultView, passing records as a prop.
      let _module = this;
      const routes = [
        {
          path: '/results',
          component: ResultView,
          props: { recordsFound: _module.recordsFound }, // TODO: Doesn't have any effect, needs fixing.
          query: _module.generateQuery(_module.recordTags)[0]
        }
      ]
      this.$router.push(routes[0]);
    },
    // This generates query parameters for the multi_tag_filter
    generateQuery(val) {
      let run = false;
      let query = {};
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
    }
  },
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

.noBreak {
  white-space: nowrap;
}

.limitWidth {
  max-width: 800px;
}

.whiteBorder {
  border: 1px solid white !important;
}

</style>
