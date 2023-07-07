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
      :class="{'flex-column':$vuetify.breakpoint.smAndDown}"
    >
      <div
        class="switchWrapper flex-column full-width"
        :class="switchDisplay"
      >
        <div
          v-for="(filter) in switchTypeFilters"
          :key="filter['filterQuery']"
        >
          <SwitchFilter :filter="filter" />
        </div>
      </div>
      <div
        class="selectWrapper flex-column full-width"
        :class="selectDisplay"
      >
        <div
          v-for="(filter) in selectTypeFilters"
          :key="filter['filterQuery']"
        >
          <SelectFilter
            :filter="filter"
          />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import addOnFilters from "@/data/addOnFilters.json"
import Loaders from "@/components/Loaders/Loaders.vue";
import currentPath from "@/utils/Others/currentPath"
import SelectFilter from "@/components/Others/SelectFilter.vue"
import SwitchFilter from "@/components/Others/SwitchFilter.vue"

export default {
  name: 'AddOnFilters',
  components: {
    Loaders,
    SelectFilter,
    SwitchFilter
  },

  data:() => {
    return {
      // filtersOpted:[],
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
      map: new Map(),
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
    ...mapGetters("nodeListStore", ['getNodeList', 'getFilterLists']),
    ...mapMutations("bubbleSelectedStore", ['resourceSelected']),
    ...mapMutations("nodeListStore", ['nodeLists']),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    switchDisplay() {
      return this.onlySelect ? 'd-none' : 'd-flex'
    },
    selectDisplay() {
      return this.onlySwitch ? 'd-none' : 'd-flex'
    },
    currentRouteQuery() {
      return this.$route.query;
    }
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      let _module = this;
      await _module.resetFiltersOnLoad()
      await _module.readRegAndTypeFilterParams();
      await _module.selectFilters();
      // await _module.readGeneralFilterParams();
      this.loading = false
    })
  },
  methods: {
    ...mapActions("variableTagStore", ["fetchVariableTags"]),

    resetFiltersOnLoad() {
      let _module = this;
      [_module.switchTypeFilters, _module.selectTypeFilters].forEach(group => {
        group.forEach(filter => {
          if (typeof filter["refineToggle"] === "boolean") filter["refineToggle"] = false
          filter["refineToggle"] = null
        })

      })
    } ,
    // readGeneralFilterParams() {
    //   // let _module = this;
    //   let params = currentPath(this.currentRouteQuery);
    //   // console.log("params::", params)
    //   const paramKeys = Object.keys(params)
    //   const paramValues = Object.values(params)
    //   const filterSelected = {
    //     "key" : paramKeys[1],
    //     "value" : [paramValues[1]]
    //   }
    //   this.$store.commit("addOnFilterSelectedStore/filtersSelected",  filterSelected)
    //
    //   this.$store.commit("nodeListStore/filterLists",  [filterSelected])
    //
    //
    //
    //
    //   // _module.selectTypeFilters.filter(filter => {
    //   //   if(Object.keys(params).length){
    //   //     Object.keys(params).forEach(key => {
    //   //       if (filter["filterQuery"] === key) {
    //   //
    //   //         filter["refineToggle"] = params[key];
    //   //         // console.log("params::", params)
    //   //         // console.log("params[key]::", params[key])
    //   //
    //   //         // const filterSelected = {
    //   //         //   "key" : params[key],
    //   //         //   "value" : params[value]
    //   //         // }
    //   //         // this.map.set(`${filter["filterQuery"]}`, `${filter["refineToggle"]}`)
    //   //         // _module.$store.commit("addOnFilterSelectedStore/filtersSelected", this.map);
    //   //       }
    //   //     })
    //   //   // console.log(Object.keys(params))
    //   //   // let selectedFilter = _module.selectTypeFilters.filter(filter =>
    //   //   //   filter["filterQuery"] === Object.keys(params)[1]
    //   //   // )
    //   //   //
    //   //   // selectedFilter[0].refineToggle = Object.values(params)[1]
    //   //   // _module.map.set(selectedFilter[0]["filterQuery"], selectedFilter[0]["refineToggle"])
    //   //   // _module.$store.commit("addOnFilterSelectedStore/filtersSelected", this.map);
    //   //   // console.log("selectedFilter::", selectedFilter)
    //   //   }
    //   //   else if(this.getFilterLists.isFilter) {
    //   //     this.getFilterLists.filtersList.forEach(item => {
    //   //       if(filter["filterQuery"] === item["key"]) {
    //   //         filter["refineToggle"] = item["value"];
    //   //         this.map.set(`${filter["filterQuery"]}`, `${item["value"]}`)
    //   //         _module.$store.commit("addOnFilterSelectedStore/filtersSelected", this.map);
    //   //       }
    //   //     })
    //   //   }
    //
    //   // });
    // },
    async readRegAndTypeFilterParams() {
      let _module = this;
      let modified = false;
      let params = currentPath(this.currentRouteQuery);
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
      // await this.readGeneralFilterParams()
      if (modified) {
        this.$store.commit('bubbleSelectedStore/resourceSelected', {topResourceSelected: _module.topResult, childResourceSelected: _module.childResult})

        //When the user is directly landing on the refine page after selecting a card from the home page
        const filtersSelected = this.getFilterLists.filtersList[0]
        this.map.set(`${filtersSelected["key"]}`, `${filtersSelected["value"]}`)
        await this.showResourceRecords(_module.topResult, _module.childResult, this.map)

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
    async showResourceRecords(topResult, childResult, filters) {
      // let filtersOpted = []

      // filters.forEach((value, key) => {
      //   this.filtersOpted.push({key, value})
      // });


      // this.$store.commit("nodeListStore/filterLists",  this.filtersOpted)



      this.$emit("filterSource", "RefineResourceView")
      let isDatabase = false
      if (topResult === "Database") {
        isDatabase = true
        topResult = ["repository", "knowledgebase", "knowledgebase_and_repository"]
      }

      let resourceSelected = ""
      if(childResult || childResult.length) resourceSelected = childResult
      else resourceSelected = topResult
      await this.fetchVariableTags([resourceSelected, null, null, "resource", filters])

      const resourceDetail = {
        records: isDatabase ? "Database" : resourceSelected,
        recordsNumber: this.variableResponse.length,
        type: childResult ? "resource" : "resourceParent"
      }
      this.$store.commit("nodeListStore/nodeLists", [resourceDetail, "RefineResourceView"])
    },
    // remove (item) {
    //   const index = this.filtersOpted.indexOf(item)
    //   if (index >= 0) this.filtersOpted.splice(index, 1)
    // },
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