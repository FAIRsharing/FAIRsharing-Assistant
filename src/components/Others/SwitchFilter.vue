<template>
  <div>
    <v-fade-transition v-if="recordsLoading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <v-radio-group
      v-model="filtersOpted"
      :label="filter['filterName']"
      @change="selectToggle(filter)"
    >
      <v-radio
        label="Yes"
        value="true"
      />
      <v-radio
        label="No"
        value="false"
      />
      <v-radio
        label="Either"
        value="null"
      />
    </v-radio-group>
  </div>
  <!--
  <v-switch
    ref="filterSelect"
    v-model="filtersOpted"
    class="d-inline-block mr-2"
    :label="filter['filterName']"
    inset
    @change="selectToggle(filter)"
  />
  -->
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Loaders from "@/components/Loaders/Loaders.vue";
//import currentPath from "@/utils/Others/currentPath";

export default {
  name: "SwitchFilter",
  components: {Loaders},
  props:{
    filter:{
      type: Object,
      required: false,
      default() {
        return {}
      }
    }

  },
  data () {
    return {
      // filtersOpted:[],
      recordsLoading: false,
      hasBeenUsed: false,
      filtersOpted: 'null',
      filterSelectedArray: [],
      // map: new Map(),
      filterSelected:{
        key:"",
        value:""
      }
    }
  },
  computed:{
    ...mapGetters("nodeListStore", ["getFilterLists"]),
    ...mapGetters("multiTagsStore", ["getQueryParams"]),
    currentRouteQuery() {
      return this.$route.query;
    },
  },

  mounted() {
    this.preSelectedFilter()
  },

  methods: {
    ...mapActions("multiTagsStore", ["fetchMultiTagData"]),
    async selectToggle(filter) {
      //console.log("this.filtersOpted::", this.filtersOpted)
      let _module = this;
      _module.hasBeenUsed = true;
      let currentQueryParams = _module.getQueryParams;
      //console.log("ONE: " + JSON.stringify(currentQueryParams));
      if (_module.filtersOpted === 'true') {
        currentQueryParams[filter['filterQuery']] = true;
      }
      else if (_module.filtersOpted === 'false') {
        currentQueryParams[filter['filterQuery']] = false;
      }
      else {
        delete currentQueryParams[filter['filterQuery']];
      }
      //console.log("TWO: " + JSON.stringify(currentQueryParams));
      // TODO: Try to update query params with currentQueryParams
      
      this.recordsLoading = true;
      await _module.fetchMultiTagData(currentQueryParams);
      this.recordsLoading = false;
      
      // Older stuff below
      /*
      filter["refineToggle"] = this.filtersOpted
      this.filterSelected = {
        "key" : filter["filterQuery"],
        "value" : filter["refineToggle"] ? [filter["refineToggle"]] : []
      }
      this.$store.commit("addOnFilterSelectedStore/filtersSelected",  this.filterSelected)
       */
    },

    preSelectedFilter () {
      // TODO: Change this to look in the store.
      /*
      let params = currentPath(this.currentRouteQuery);
      const objEntries = Object.entries (params)
      for (let i = 0; i < objEntries.length; i++) {
        let filterSelectedObj = {}
        for (let j = 0; j < objEntries[i].length; j++) {
          filterSelectedObj["key"] = objEntries[i][0]
          filterSelectedObj["value"] = objEntries[i][1].split(",")
        }
        this.filterSelectedArray.push(filterSelectedObj)
      }

      this.filterSelectedArray = this.filterSelectedArray.filter(({key}) => key !== "registry")

      if (this.filterSelectedArray && this.filterSelectedArray.length) {
        this.filterSelectedArray.forEach(item => {
          if (item["key"] === this.filter["filterQuery"]) {
            this.filtersOpted = item["value"][0]
            this.$store.commit("addOnFilterSelectedStore/filtersSelected",  item)
            this.$store.commit("nodeListStore/filterLists",  item)
          }
        })
      }
       */
      let _module = this;
      let existing  = _module.getQueryParams[_module.filter.filterQuery];
      if (existing) {
        _module.filtersOpted = String(existing);
      }
    },
  }
}
</script>
