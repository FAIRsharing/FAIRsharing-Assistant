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
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search in results"
        single-line
        hide-details
        class="pa-10"
      />
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
    </v-container>
  </div>
</template>

<script>
import Jumbotron from "@/components/Navigation/Jumbotron";
import GraphClient from "@/lib/GraphClient/GraphClient";
import multiTagsNonExactFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";
import currentPath from "@/utils/Others/currentPath"

const CLIENT = new GraphClient();
const MULTI_TAGS = JSON.parse(JSON.stringify(multiTagsNonExactFilter));
MULTI_TAGS.queryParam = {};

export default {
  name: 'ResultView',
  components: {
    Jumbotron,
  },
  data () {
    return {
      loading: true,
      error: null,
      search: '',
      records: [],
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
    currentRouteQuery() {
      return this.$route.query;
    }
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    async getData() {
      let _module = this;
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