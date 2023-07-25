<template>
  <div
    class="d-flex flex-column justify-start align-stretch"
  >
    <Jumbotron />
    <v-container
      v-if="error"
      fluid
      class="pa-0"
    >
      <p class="pa-10">
        Sorry, something went wrong!
      </p>
    </v-container>
    <v-container
      v-else
      fluid
      class="pa-0"
    >
      <v-row
        class="block-category"
      >
        <v-col>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search in results"
            single-line
            hide-details
            class="pa-10"
          />
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="records"
        :search="search"
        :sort-by="[{ key: 'name', order: 'asc' }, { key: 'registry', order: 'desc' }, { key: 'type', order: 'desc' }]"
        multi-sort
        :loading="loading"
        loading-text="Loading... Please wait"
        :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
        class="pa-10"
      >
        <template #[`item.link`]="{ item }">
          <a
            target="_blank"
            class="underline-effect"
            :href="'https://fairsharing.org/' + item.id"
          >
            https://fairsharing.org/{{ item.id }}
          </a>
        </template>
      </v-data-table>
      <v-row
        class="pb-10"
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
            <span> Refine your choice of scientific field. </span>
          </v-tooltip>
          <v-btn
            :disabled="!tagButtonActive"
            color="internal white--text"
            class="mr-10"
            @click="returnToTags()"
          >
            Return to tags
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
            <span> Change your registry-specific filters. </span>
          </v-tooltip>
          <v-btn
            :disabled="!registryButtonActive"
            color="internal white--text"
            class="mr-10"
            @click="returnToRegistries()"
          >
            Return to registry
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
            <span> Clear all selections and return to the search page. </span>
          </v-tooltip>
          <v-btn
            :disabled="!clearButtonActive"
            color="dev_color white--text"
            class="mr-10"
            @click="clearResults()"
          >
            Clear selection
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Jumbotron from "@/components/Navigation/Jumbotron";
import GraphClient from "@/lib/GraphClient/GraphClient";
import multiTagsNonExactFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";
import currentPath from "@/utils/currentPath"
import { mapGetters } from "vuex";

const CLIENT = new GraphClient();
const MULTI_TAGS = JSON.parse(JSON.stringify(multiTagsNonExactFilter));
MULTI_TAGS.queryParam = {};

export default {
  name: 'ResultView',
  components: {
    Jumbotron,
  },
  // TODO: Passing in these props fails to do what's required.
  data () {
    return {
      records: [],
      loading: true,
      error: null,
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Registry', value: 'registry' },
        { text: 'Type', value: 'type' },
        { text: 'Status', value: 'status' },
        { text: 'Link', value: 'link' },
      ],
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getQueryParams", "getRefinedStatus", "getCurrentRegistry"]),
    currentRouteQuery() {
      return this.$route.query;
    },
    registryButtonActive() {
      if (this.getRefinedStatus) {
        return true;
      }
      return false;
    },
    tagButtonActive() {
      if (this.getFairSharingRecords && this.getFairSharingRecords.length > 0) {
        return true;
      }
      return false;
    },
    clearButtonActive() {
      let _module = this;
      if (_module.getFairSharingRecords && _module.getFairSharingRecords.length > 0) {
        return true;
      }
      else if (_module.getQueryParams && Object.keys(_module.getQueryParams).length > 0) {
        return true;
      }
      else if (_module.getRefinedStatus) {
        return true;
      }
      else if (_module.getCurrentRegistry) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    // TODO: Stuck here. Should be able to check the store and use that for records instead of loading them.
    async getData() {
      let _module = this;
      _module.records = _module.getFairSharingRecords || [];
      //console.log("REC: " + _module.records);
      if (_module.records.length > 0) {
        _module.loading = false;
        return;
      }
      // This converts the values from those in the URL to an appropriate form to send
      // as a graphql query (fixing arrays, capitalisation etc.)
      Object.keys(currentPath(this.currentRouteQuery)).forEach(key => {
        MULTI_TAGS.queryParam[key] = currentPath(this.currentRouteQuery)[key].toLowerCase().split(',');
      })
      let response = await CLIENT.executeQuery(MULTI_TAGS);
      // TODO: Handle errors from the server.
      if (!response.error) {
        _module.records = response['multiTagFilter'];
      }
      else {
        _module.error = true;
      }
      _module.loading = false;
    },
    clearResults() {
      this.$store.commit('multiTagsStore/setRefinedStatus', false);
      this.$store.commit('multiTagsStore/setQueryParams', {});
      this.$store.commit('multiTagsStore/setFairSharingRecords', []);
      this.$store.commit('multiTagsStore/setCurrentRegistry', null);
      this.$router.push('/researchfields');
    },
    returnToTags() {
      this.$router.push('/researchfields');
    },
    returnToRegistries() {
      this.$router.push('/refineregistry');
    }
  },
};
</script>

<style scoped lang="scss">
.wrapperClass{
  position: relative;
}

.smallScreen {
  height: auto;
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