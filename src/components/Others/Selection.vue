<template>
  <div>
    <p
      v-if="getTopResource"
      class="ma-0 text-capitalize"
    >
      Resource Type Selected: {{ getResource ? getResource : getTopResource }}
    </p>
    <p
      v-if="getSubject"
      class="ma-0 text-capitalize"
    >
      Subject Type Selected: {{ getSubject }}
    </p>
    <p
      v-if="getDomain"
      class="ma-0 text-capitalize"
    >
      Domain Type Selected: {{ getDomain }}
    </p>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: 'Selection',
  data:() => {
    return {
      allowedRegistries: ['Database', 'Standard', 'Policy', 'Collection'],
      allowedTypes: [
        "repository",
        "knowledgebase",
        "model_and_format",
        "metric",
        "terminology_artefact",
        "reporting_guideline",
        "identifier_schema",
        "journal",
        "society",
        "project",
        "institution",
        "collection",
        "journal_publisher",
        "knowledgebase_and_repository",
        "funder"
      ]
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource', 'getSubject', 'getDomain']),
    ...mapMutations("bubbleSelectedStore", ['resourceSelected']),
    currentPath: function () {
      const client = this;
      let queryParams = {};
      Object.keys(this.$route.query).forEach(function (prop) {
        let queryVal = client.$route.query[prop];
        if (queryVal) {
          queryParams[prop] = decodeURI(queryVal);
        }
      });
      return queryParams;
    }
  },
  watch: {
    '$route' () {
      this.readFilterParams();
    }
  },
  mounted() {
    this.readFilterParams();
  },
  methods: {
    readFilterParams() {
      let _module = this;
      let modified = false;
      let topResult = '';
      let childResult = '';
      let params = _module.currentPath;
      Object.keys(params).forEach(function(key) {
        if (key === 'registry') {
          if (_module.allowedRegistries.indexOf(params[key]) > -1) {
            topResult = params[key];
            modified = true;
          }
        }
        if (key === 'record_type') {
          if (_module.allowedTypes.indexOf(params[key]) > -1) {
            childResult = params[key];
            modified = true;
          }
        }
      })
      if (modified) {
        this.$store.commit('bubbleSelectedStore/resourceSelected', {topResourceSelected: topResult, childResourceSelected: childResult})
      }
    }
  }

};
</script>