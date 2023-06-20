<template>
  <div
    class="d-flex flex-column justify-start align-stretch"
  >
    <Jumbotron />
    <v-container
      fluid
      class="pa-0"
    >
      <v-data-table
        :headers="headers"
        :items="records"
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
      records: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Link', value: 'link' },
      ],
    }
  },
  computed: {
    currentPath () {
      const client = this;
      let queryParams = {};
      Object.keys(this.$route.query).forEach(prop => {
        let queryVal = client.$route.query[prop];
        if (queryVal) {
          queryParams[prop] = decodeURI(queryVal);
        }
      });
      return queryParams;
    }
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    async getData() {
      let _module = this;
      console.log(JSON.stringify(this.currentPath));
      // This converts the values from those in the URL to an appropriate form to send
      // as a graphql query (fixing arrays, capitalisation etc.)
      Object.keys(_module.currentPath).forEach(key => {
        MULTI_TAGS.queryParam[key] = _module.currentPath[key].toLowerCase().split(',');
      })
      let response = await CLIENT.executeQuery(MULTI_TAGS);
      // TODO: Handle errors from the server.
      console.log(JSON.stringify(response));
      _module.records = response['multiTagFilter'];
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
