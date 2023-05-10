<template>
  <div>
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
    <ApplyFilterButton />
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import addOnFilters from "@/data/addOnFilters.json"
import ApplyFilterButton from "@/components/Navigation/ApplyFilterButton";

export default {
  name: 'AddOnFilters',
  components: {
    ApplyFilterButton
  },
  data:() => {
    return {
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
    switchDisplay() {
      return this.onlySelect ? 'd-none' : 'd-flex'
    },
    selectDisplay() {
      return this.onlySwitch ? 'd-none' : 'd-flex'
    },
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
    },
  },
  /*
  watch: {
    'switchTypeFilters': {
      handler: function (before, after) {
        this.applyFilters(before, after);
      },
      deep: true
    },
    'selectTypeFilters': {
      handler: function () {
        console.log("Filters changed!");
        this.applyFilters();
      },
      deep: true
    }
  },
   */
  mounted() {
    let _module = this;
    //_module.selectToggle();
    _module.readRegAndTypeFilterParams();
    _module.selectFilters();
    _module.readGeneralFilterParams();
  },
  methods: {
    readGeneralFilterParams() {
      let _module = this;
      let params = _module.currentPath;
      [_module.switchTypeFilters, _module.selectTypeFilters].forEach(function(group) {
        group.forEach(function(filter) {
          Object.keys(params).forEach(function(key) {
            if (filter.filterQuery === key) {
              console.log("Setting " + filter.filterQuery + " to " + params[key]);
              filter.refineToggle = params[key];
              console.log(filter.refineToggle);
            }
          })
        })
      });
    },
    readRegAndTypeFilterParams() {
      let _module = this;
      let modified = false;
      let params = _module.currentPath;
      Object.keys(params).forEach(function(key) {
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
      }
    },
    selectFilters(){
      console.log("Running selectFilters");
      const prevRoute = this.$router.history._startLocation;
      const selectedRegistry = this.topResult;
      if(prevRoute === "/database" || selectedRegistry === 'Database') {
        console.log("Database selected");
        const databaseSwitchFilters = this.switchTypeFilters.filter(({filterTypes}) => filterTypes.includes("database"))
        this.switchTypeFilters = databaseSwitchFilters
        const databaseSelectFilters = this.selectTypeFilters.filter(({filterTypes}) => filterTypes.includes("database"))
        this.selectTypeFilters = databaseSelectFilters
        this.conditionalDisplay()
      }
      else if(prevRoute === "/standards" || selectedRegistry === 'Standard') {
        console.log("Standard selected");
        const standardsSwitchFilters = this.switchTypeFilters.filter(({filterTypes}) => filterTypes.includes("standards"))
        this.switchTypeFilters = standardsSwitchFilters
        const standardsSelectFilters = this.selectTypeFilters.filter(({filterTypes}) => filterTypes.includes("standards"))
        this.selectTypeFilters = standardsSelectFilters
        this.conditionalDisplay()
      }
      else if(prevRoute === "/policies" || selectedRegistry === 'Policy') {
        console.log("Policy  selected");
        const policiesSwitchFilters = this.switchTypeFilters.filter(({filterTypes}) => filterTypes.includes("policies"))
        this.switchTypeFilters = policiesSwitchFilters
        const policiesSelectFilters = this.selectTypeFilters.filter(({filterTypes}) => filterTypes.includes("policies"))
        this.selectTypeFilters = policiesSelectFilters
        this.conditionalDisplay()
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
      [_module.switchTypeFilters, _module.selectTypeFilters].forEach(function(group) {
        group.forEach(function (filter) {
          //console.log(JSON.stringify(filter));
          if (typeof(filter.refineToggle) != 'undefined' &&
            filter.refineToggle != null &&
            filter.refineToggle !== ''
          ) {
            newParams[filter.filterQuery] = filter.refineToggle;
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