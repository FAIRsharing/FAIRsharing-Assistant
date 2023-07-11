<template>
  <v-radio-group
    :label="filter['filterName']"
    v-model="filtersOpted"
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
//import currentPath from "@/utils/Others/currentPath";

export default {
  name: "SwitchFilter",
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
      await _module.fetchMultiTagData(currentQueryParams);

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
      let existing  = _module.getQueryParams[_module.filter.filterName];
      if (existing) {
        _module.filtersOpted = existing;
      }
    },
  }
}
</script>
