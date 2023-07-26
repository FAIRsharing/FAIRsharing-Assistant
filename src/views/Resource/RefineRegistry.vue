<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <v-row
        class="block-category pb-5"
      >
        <v-col
          cols="2"
          sm="12"
          md="3"
          lg="3"
        >
          <v-card
            class="mx-auto block-category__card"
            max-width="350"
            height="215"
          >
            <div
              class="white--text d-flex flex-column justify-center block-category__card__gradiant"
              style="height: 100%;"
            >
              <div
                style="height: 136px"
                class="d-flex justify-center"
              >
                <v-img
                  class="mt-5"
                  contain
                  height="100px"
                  :src="$vuetify.icons.values[countIcon[getCurrentRegistry]].icon"
                />
              </div>
              <v-card-title class="d-inline text-h4 text-md-h5 text-lg-h4 text-center">
                {{ getCurrentRegistry }}: {{ recordsAvailable }}
              </v-card-title>
            </div>
          </v-card>
        </v-col>
        <v-col
          cols="10"
          sm="12"
          md="9"
          lg="9"
        >
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
                  {{ sectionName.toUpperCase() }}
                </td>
                <td :class="section.color + ' lighten-2'">
                  <v-chip-group
                    class="pl-2"
                    column
                  >
                    <v-chip
                      v-for="(tag, tagIndex) in getQueryParams[section.label]"
                      :key="'section_' + sectionIndex + '_tag_' + tagIndex"
                      :class="[section.color + '--text white']"
                    >
                      {{ capitaliseText(tag, section.label) }}
                    </v-chip>
                  </v-chip-group>
                </td>
              </tr>
            </tbody>
          </table>
        </v-col>
      </v-row>
      <v-row
        class="block-category pb-5"
      >
        <v-col
          class="text-center"
        >
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                small
                class="grey--text mr-1"
                v-on="on"
              >
                fa-question-circle
              </v-icon>
            </template>
            <span> See the list of FAIRsharing records matching your selections below. </span>
          </v-tooltip>
          <v-btn
            :disabled="!resultsButtonActive"
            color="internal white--text"
            class="mr-10"
            @click="showResults()"
          >
            View records
          </v-btn>
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                small
                class="grey--text mr-1"
                v-on="on"
              >
                fa-question-circle
              </v-icon>
            </template>
            <span> Refine your choice of scientific field. </span>
          </v-tooltip>
          <v-btn
            :disabled="!tagButtonActive"
            color="internal white--text"
            class="mr-10"
            @click="returnToTags()"
          >
            Refine tags
          </v-btn>
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                small
                class="grey--text mr-1"
                v-on="on"
              >
                fa-question-circle
              </v-icon>
            </template>
            <span> Clear all selections and tags and return to the tag filter page. </span>
          </v-tooltip>
          <v-btn
            :disabled="!clearButtonActive"
            color="dev_color white--text"
            class="mr-10"
            @click="clearResults()"
          >
            Clear all selections
          </v-btn>
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                small
                class="grey--text mr-1"
                v-on="on"
              >
                fa-question-circle
              </v-icon>
            </template>
            <span> Return to the home page, clearing all tags and filters. </span>
          </v-tooltip>
          <v-btn
            color="dev_color white--text"
            class="mr-10"
            @click="goHome()"
          >
            Home
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        class="block-category pb-5"
      >
        <p>Below, you can select what sort of <b>{{ getCurrentRegistry }}</b> record you need.</p>
        <p
          v-if="getCurrentRegistry === 'Policy'"
        >
          Please note that curation is still in progress for our policies, and some search filters below might not give the expected result.
        </p>
      </v-row>
      <AddOnFilters @filterSource="capitaliseText(getQueryParams['fairsharingRegistry'][0], null)" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Jumbotron from "@/components/Navigation/Jumbotron";
import AddOnFilters from "@/components/Others/AddOnFilters.vue";

export default {
  name: 'RefineRegistry',
  components: {
    AddOnFilters,
    Jumbotron,
  },
  data:() => {
    return {
      recordsLoading: false,
      recordTypes: {},
      countIcon: {
        Database: 'home_db',
        Standard: 'home_standard',
        Policy: 'home_policies',
        Collection: 'home_collection'
      },
      colors: {
        domain: 'domain_color',
        taxonomy: 'taxonomic_color',
        subject: 'subject_color',
        user_defined_tag: 'tags_color'
      },
    }
  },
  computed:{
    ...mapGetters("multiTagsStore", ['getQueryParams', 'getFairSharingRecords', 'getLoadingStatus', 'getCurrentRegistry']),
    recordsAvailable() {
      if (!this.getFairSharingRecords) {
        return 0;
      }
      return this.getFairSharingRecords.filter(x => x.registry === this.getCurrentRegistry).length
    },
    sections() {
      return {
        subjects: {
          items: [],
          color: this.colors["subject"],
          //tooltip: this.tooltips.subjects
          tooltip: "Subjects you have selected will be shown here.",
          label: 'subjects'
        },
        domains: {
          items: [],
          color: this.colors["domain"],
          //tooltip: this.tooltips.domains
          tooltip: "Domains you have selected will be shown here.",
          label: 'domains'
        },
        "taxonomic range": {
          items: [],
          color: this.colors["taxonomy"],
          //tooltip: this.tooltips.species
          tooltip: 'Taxonomy tags you have selected will be shown here.',
          labe: 'taxonomies'
        },
        "user defined tags": {
          items: [],
          color: this.colors["user_defined_tag"],
          //tooltip: this.tooltips.userDefinedTags
          tooltip: "The tags shown here are those created by FAIRsharing users/curators to describe records when a suitable tag in the groups above couldn't be found.",
          label: 'userDefinedTags'
        },
      }
    },
    clearButtonActive() {
      let _module = this;
      if (_module.getFairSharingRecords && _module.getFairSharingRecords.length > 0) {
        return true;
      }
      else if (Object.keys(_module.getQueryParams).length > 0) {
        return true;
      }
      else if (_module.getRefinedStatus) {
        return true;
      }
      return false;
    },
    resultsButtonActive() {
      let _module = this;
      if (_module.getFairSharingRecords && _module.getFairSharingRecords.length > 0) {
        return true;
      }
      return false;
    },
    tagButtonActive() {
      return true;
    },
  },
  async mounted() {
    /*
        console.log(JSON.stringify(this.getQueryParams));
        console.log(JSON.stringify(this.getFairSharingRecords));
         */
    // If a user has come here then they've set the refinement status by choosing a registry
    if (!this.getCurrentRegistry) {
      this.$store.commit('multiTagsStore/setRefinedStatus', false);
      this.$router.push('/researchfields');
    }
    this.$store.commit('multiTagsStore/setRefinedStatus', true);
  },
  methods: {
    ...mapActions('multiTagsStore', ['fetchMultiTagData', 'resetMultiTags']),
    async getData() {

    },
    capitaliseText(text, type) {
      if (type === null || type === 'taxonomies') {
        // Upper case for first character only.
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      }
      else {
        // Upper case for first letter of each word.
        return text.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
      }
    },
    showResults() {
      // TODO: Query could perhaps be deleted.
      /*
            const routeData = this.$router.resolve({
              path: '/results',
              //query: _module.generateQuery(_module.recordTags)[0] // TODO: Make a (better) generateQuery component
            })
             */
      //window.open(routeData.href, '_blank')
      this.$router.push('/results');
    },
    clearResults() {
      // this.$store.commit('multiTagsStore/setRefinedStatus', false);
      // this.$store.commit('multiTagsStore/setQueryParams', {});
      // this.$store.commit('multiTagsStore/setFairSharingRecords', []);
      // this.$store.commit('multiTagsStore/setCurrentRegistry', null);
      this.$router.push('/researchfields');
      this.resetMultiTags()
    },
    goHome() {
      this.$store.commit('multiTagsStore/setRefinedStatus', false);
      this.$store.commit('multiTagsStore/setQueryParams', {});
      this.$store.commit('multiTagsStore/setFairSharingRecords', []);
      this.$store.commit('multiTagsStore/setCurrentRegistry', null);
      this.$router.push('/')
    },
    returnToTags() {
      this.$router.push('/researchfields');
    },
  }
};
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

<style scoped lang="scss">
.block-category {
  &__card {
    transition: all .2ms ease;
    -webkit-transition: all .2s ease;
    -moz-transition: all .2s ease;
    -o-transition: all .2s ease;
    box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -webkit-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -moz-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -o-box-shadow: 0 1rem 2rem rgba(black, .15) !important;

    &:hover {
      transform: scale(1.05);
      -moz-transform: scale(1.05);
      -webkit-transform: scale(1.05);
      -o-transform: scale(1.05);
    }

    &__gradiant {
      height: 200px;
      background: rgb(171, 171, 171);
    }
  }
}
.v-divider {
  margin: 8px;
}
</style>