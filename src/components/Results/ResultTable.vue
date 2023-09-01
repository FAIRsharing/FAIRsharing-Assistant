<template>
  <div
    class="d-flex flex-column justify-start align-stretch"
  >
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
      class="pa-5"
    >
      <v-data-iterator
        :items="records"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        :footer-props="{'items-per-page-options': [10, 25, 50, 100]}"
      >
        <!-- headers start -->
        <template #header>
          <v-toolbar
            dark
            color="blue lighten-1"
            class="mb-5"
          >
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
            />
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <v-spacer />
              <v-select
                v-model="sortBy"
                flat
                solo-inverted
                hide-details
                :items="keys"
                prepend-inner-icon="mdi-magnify"
                label="Sort by"
              />
              <v-spacer />
              <v-btn-toggle
                v-model="sortDesc"
                mandatory
              >
                <v-btn
                  large
                  depressed
                  color="blue"
                  :value="false"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn
                  large
                  depressed
                  color="blue"
                  :value="true"
                >
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>
        </template>
        <!-- headers stop -->
        <!-- data section begins -->
        <template #default="props">
          <v-row>
            <v-col
              v-for="item in props.items"
              :key="item.name"
              cols="12"
            >
              <v-card>
                <v-card-title class="subheading font-weight-bold">
                  <RecordStatus
                    :record="item"
                  />
                  <a
                    :href="'https://fairsharing.org/' + item.id"
                    target="_blank"
                    class="ml-10"
                  >
                    {{ item.name }}
                  </a>
                </v-card-title>
                <p
                  class="mt-2 ml-10 pr-2 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-2lines"
                >
                  {{ item. description }}
                </p>

                <SearchLinkChips
                  :record="item"
                  class="ml-10"
                />

                <!-- TODO: this is a hacky placeholder -->
                <p
                  class="pb-5"
                >

                </p>

                <!-- TODO: change below here -->
                <!--
                <v-divider />

                <span>
                  Some information about number of standards etc. can go here. 
                </span>

                -->
                <!-- TODO: change above here -->
              </v-card>
            </v-col>
          </v-row>
        </template>
        <!-- data section ends -->
        <!-- footer ends -->
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GraphClient from "@/lib/GraphClient/GraphClient";
import multiTagsNonExactFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";
import RecordStatus from "@/components/Results/RecordStatus.vue";
import SearchLinkChips from "@/components/Results/SearchLinkChips.vue";
import currentPath from "@/utils/currentPath"


const CLIENT = new GraphClient();
const MULTI_TAGS = JSON.parse(JSON.stringify(multiTagsNonExactFilter));
MULTI_TAGS.queryParam = {};

export default {
  name: 'ResultTable',
  components: { RecordStatus, SearchLinkChips },
  // TODO: Passing in these props fails to do what's required.
  data () {
    return {
      itemsPerPageArray: [10, 20, 50, 100, 200],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 5,
      sortBy: 'name',
      records: [],
      loading: true,
      error: false,
      keys: [
        'Name',
        'Registry',
        'Type',
        'Status',
        'Description'
      ]
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getCurrentRegistry"]),
    currentRouteQuery() {
      return this.$route.query;
    },
    filteredKeys () {
      return this.keys.filter(key => key !== 'Name' && key !== 'Description')
    },
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    async getData() {
      let _module = this;
      _module.records = _module.getFairSharingRecords || [];
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
        this.$store.commit('multiTagsStore/setError', true);
        this.$emit('isError', true);
      }
      _module.loading = false;
    },
  },
};
</script>
