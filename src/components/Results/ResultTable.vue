<template>
  <div
    class="d-flex flex-column justify-start align-stretch"
  >
    <v-container
      v-if="error"
      fluid
      class="pa-0"
    >
      <p
        class="pa-10"
      >
        Sorry, something went wrong!
      </p>
    </v-container>
    <v-container
      v-else
      fluid
      class="pa-5"
    >
      <v-btn
        class="mb-2"
        color="primary"
        size="small"
        @click="chooseDownload()"
      >
        Download Results
      </v-btn>
      <v-data-iterator
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="records"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        :footer-props="{'items-per-page-options': [5, 10, 25, 50, 100]}"
      >
        <!-- headers start -->
        <template #header>
          <v-toolbar
            dark
            color="blue-lighten-1"
            class="mb-5"
          >
            <v-text-field
              v-model="search"
              clearable
              flat
              variant="solo-inverted"
              hide-details
              prepend-inner-icon="mdi-filter"
              label="Filter these results"
            />
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <v-spacer />
              <v-select
                v-model="sortBy"
                flat
                variant="solo-inverted"
                hide-details
                :items="keys"
                prepend-inner-icon="mdi-sort"
                label="Sort by"
              />
              <v-spacer />
              <v-btn-toggle
                v-model="sortDesc"
                mandatory
              >
                <v-btn
                  size="large"
                  variant="flat"
                  color="blue"
                  :value="false"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn
                  size="large"
                  variant="flat"
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
                    :href="fairSharingURL + '/' + getRecordLink(item)"
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

                <TagChips
                  :record="item"
                  class="ml-10"
                />

                <!-- TODO: this is a hacky placeholder -->
                <p
                  class="pb-5"
                />

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
    <v-dialog
      v-model="chooseDownloadActive"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          Do you need information on organisations?
        </v-card-title>
        <v-card-text>
          Selecting "yes" here will add a FAIRsharing record's organisations to your download file. This will increase
          the file size as each organisation will require a separate line. Select "no" to download without organisations.
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="commenceDownload(true)"
          >
            Yes
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="commenceDownload(false)"
          >
            No
          </v-btn>
          <v-btn
            color="red-darken-1"
            variant="text"
            @click="chooseDownloadActive = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GraphClient from "@/lib/GraphClient/GraphClient";
import multiTagsNonExactFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";
import RecordStatus from "@/components/Results/RecordStatus.vue";
import TagChips from "@/components/Results/TagChips.vue";
import currentPath from "@/utils/currentPath"
import recordsCardUtils from "@/utils/recordsCardUtils";


const CLIENT = new GraphClient();
const MULTI_TAGS = JSON.parse(JSON.stringify(multiTagsNonExactFilter));
MULTI_TAGS.queryParam = {};

export default {
  name: 'ResultTable',
  components: { RecordStatus, TagChips },
  mixins: [recordsCardUtils],
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
      ],
      fairSharingURL: process.env.VUE_APP_FAIRSHARING_URL,
      chooseDownloadActive: false
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
    chooseDownload() {
      this.chooseDownloadActive = true;
    },
    async commenceDownload(includeOrgs) {
      this.chooseDownloadActive = false;
      var MIME_TYPE = "text/csv";
      let data;
      let seen = [];
      if (includeOrgs) {
        data = ["name,abbreviation,URL,org_relationship,org_name,org_fairsharing_url\n"];
        this.getFairSharingRecords.forEach((record) => {
          record.organisationLinks.forEach((link) => {
            let identifier = `${link.relation}_${link.organisation.id}`;
            if (!seen.includes(identifier)) {
              data.push(`${record.name},${record.abbreviation || 'n/a'},https://fairsharing.org/${record.id},${link.relation},${link.organisation.name.replaceAll(",", "-")},https://fairsharing.org/organisations/${link.organisation.id}\n`);
            }
            seen.push(identifier);
          })
        })
      }
      else {
        data = ["name,abbreviation,URL\n"];
        this.getFairSharingRecords.forEach((record) => {
          data.push(`${record.name},${record.abbreviation || 'n/a'},https://fairsharing.org/${record.id}\n`);
        })
      }
      var blob = new Blob(data, {type: MIME_TYPE});
      window.location.href = window.URL.createObjectURL(blob);
    }
  },
};
</script>
