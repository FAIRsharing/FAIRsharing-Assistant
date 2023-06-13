<template>
  <div>
    <v-fade-transition v-if="loading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <v-container
      class="filterWrapper ma-0 d-flex flex-row align-stretch"
    >
      <div
        class="switchWrapper flex-column full-width"
        :class="switchDisplay"
      >
        <v-switch
          v-for="(filter) in switchTypeFilters"
          :key="filter['filterQuery']"
          v-model="filter['refineToggle']"
          class="d-inline-block mr-2"
          :label="filter['filterName']"
          inset
          :value="filter['refineToggle']"
          @change="selectToggle()"
        />
      </div>
      <div
        class="selectWrapper flex-column full-width"
        :class="selectDisplay"
      >
        <v-select
          v-for="(filter) in selectTypeFilters"
          ref="filterSelect"
          :key="filter['filterQuery']"
          v-model="filter['refineToggle']"
          :items="filter['options']"
          :label="filter['filterName']"
          clearable
          variant="underlined"
          @change="selectToggle()"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import addOnFilters from "@/data/addOnFilters.json"
import Loaders from "@/components/Loaders/Loaders.vue";

export default {
  name: 'AddOnFilters',
  components: {Loaders},

  data:() => {
    return {
      loading: false,
      prevRoute: null,
      topResult: '',
      childResult: '',
      switchTypeFilters: addOnFilters["switch"],
      selectTypeFilters: addOnFilters["select"],
      allFilters: [],
      addOnFilters: [...addOnFilters["switch"], ...addOnFilters["select"]],
      onlySwitch: false,
      onlySelect: false,
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
    ...mapMutations("nodeListStore", ['nodeLists']),
    ...mapState("multiTagsStore", ["fairSharingRecords", "loadingStatus"]),
    switchDisplay() {
      return this.onlySelect ? 'd-none' : 'd-flex'
    },
    selectDisplay() {
      return this.onlySwitch ? 'd-none' : 'd-flex'
    },
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
    },
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      let _module = this;
      await _module.readRegAndTypeFilterParams();
      await _module.selectFilters();
      await _module.readGeneralFilterParams();
      this.loading = false
    })
  },
  methods: {
    ...mapActions("multiTagsStore", ["fetchMultiTagsTerms", "resetMultiTags"]),
    readGeneralFilterParams() {
      let _module = this;
      let map = new Map();
      let params = _module.currentPath;
      [_module.switchTypeFilters, _module.selectTypeFilters].forEach(group => {
        group.forEach(filter => {
          Object.keys(params).forEach(key =>{
            //Reset the filters before assigning any value
            if (typeof filter["refineToggle"] === "boolean") filter["refineToggle"] = false
            filter["refineToggle"] = null

            if (filter["filterQuery"] === key) {
              filter["refineToggle"] = params[key];
              map.set(`${filter["filterQuery"]}`, `${filter["refineToggle"]}`)
              _module.$store.commit("addOnFilterSelectedStore/filtersSelected", map);
            }
          })
        })
      });
    },
    async readRegAndTypeFilterParams() {
      let _module = this;
      let modified = false;
      let params = _module.currentPath;
      Object.keys(params).forEach(key => {
        if (key === 'registry') {
          if (_module.allowedRegistries.indexOf(params[key]) > -1) {
            _module.topResult = params[key];
            modified = true;
          }
        }
        if (key === 'record_type') {
          if (_module.allowedTypes.indexOf(params[key]) > -1) {
            _module.childResult = params[key];
            modified = true;
          }
        }
      })
      if (modified) {
        this.$store.commit('bubbleSelectedStore/resourceSelected', {topResourceSelected: _module.topResult, childResourceSelected: _module.childResult})

        //When the user is directly landing on the refine page from the home page
        await this.showResourceRecords(_module.topResult, _module.childResult)

      }
    },
    selectFilters(){
      const prevRoute = localStorage.getItem("pageName");
      const selectedRegistry = this.topResult;
      //When previous page or selection link is related to 'Database'
      if(prevRoute === "DatabaseView" || selectedRegistry === 'Database') {
        this.conditionalFilters("database")
      }
      //When previous page or selection link is related to 'Standard'
      else if(prevRoute === "StandardsView" || selectedRegistry === 'Standard') {
        this.conditionalFilters("standards")
      }
      //When previous page or selection link is related to 'Policy'
      else if(prevRoute === "PoliciesView" || selectedRegistry === 'Policy') {
        this.conditionalFilters("policies")
      }
    },
    applyFilters() {
      let _module = this;
      let params = _module.currentPath;
      let newParams = {};
      // Set the list of parameters of interest
      if ('registry' in params) {
        newParams.registry = params.registry;
      }
      if ('record_type' in params) {
        newParams.record_type = params.record_type;
      }
      [_module.switchTypeFilters, _module.selectTypeFilters].forEach(group => {
        group.forEach(filter => {
          //console.log(JSON.stringify(filter));
          if (typeof(filter["refineToggle"]) !== 'undefined' &&
              filter["refineToggle"] !== null &&
              filter["refineToggle"] !== ''
          ) {
            newParams[filter.filterQuery] = filter["refineToggle"];
          }
        })
      })
      _module.$router.push({
        name: _module.$route.name,
        query: newParams
      }).catch(err => {
        // Ignore the vuex err regarding  navigating to the page they are already on.
        if (
          err.name !== 'NavigationDuplicated' &&
          !err.message.includes('Avoided redundant navigation to current location')
        ) {
          // But print any other errors to the console
          //console.log(err);
        }
      });
    },
    selectToggle() {
      let map = new Map();
      for (let filter of this.addOnFilters) {
        map.set(`${filter["filterQuery"]}`, `${filter["refineToggle"]}`)
      }
      this.applyFilters();
      this.$store.commit("addOnFilterSelectedStore/filtersSelected", map)
    },
    conditionalDisplay() {
      if (!this.switchTypeFilters?.length && this.selectTypeFilters?.length) {
        this.onlySelect = true
      }
      else if (this.switchTypeFilters?.length && !this.selectTypeFilters?.length) {
        this.onlySwitch = true
      }
    },
    conditionalFilters(registry) {
      const registrySwitchFilters = this.switchTypeFilters.filter(({filterTypes}) => filterTypes.includes(registry))
      this.switchTypeFilters = registrySwitchFilters
      const registrySelectFilters = this.selectTypeFilters.filter(({filterTypes}) => filterTypes.includes(registry))
      this.selectTypeFilters = registrySelectFilters
      this.conditionalDisplay()
    },
    async showResourceRecords(topResult, childResult) {
      localStorage.setItem("pageName", "ResourceView")
      let resourceSelected = ""
      if(childResult) resourceSelected = childResult
      else resourceSelected = topResult
      await this.fetchMultiTagsTerms([resourceSelected, null, null])
      const resourceDetail = {
        records: resourceSelected,
        recordsNumber: this.fairSharingRecords.length,
        type: childResult ? "resource" : "resourceParent"
      }
      this.$store.commit("nodeListStore/nodeLists", [resourceDetail, "ResourceView"])
    }
  }
};
</script>

<style scoped lang="scss">
.filterWrapper {
  justify-content: space-evenly;
}
.switchWrapper {
  max-width: 250px;
}

.selectWrapper {
  max-width: 350px;
}
</style>