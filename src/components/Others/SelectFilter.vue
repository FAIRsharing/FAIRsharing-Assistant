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
    <v-select
      ref="filterSelect"
      v-model="filtersOpted"
      :items="filter['options']"
      :label="cleanText(filter['filterName'])"
      clearable
      multiple
      chips
      return-object
      @change="selectToggle(filter)"
    >
      <template #selection="data">
        <v-chip
          v-bind="data.attrs"
          :input-value="data.selected"
          class="blue white--text"
        >
          {{ data.item }}
        </v-chip>
      </template>
    </v-select>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
//import currentPath from "@/utils/Others/currentPath";
import Loaders from "@/components/Loaders/Loaders.vue";

export default {
  name: "SelectFilter",
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
      filtersOpted:"",
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
      let _module = this;
      filter["refineToggle"] = this.filtersOpted
      _module.filterSelected = {
        "key" : filter["filterQuery"],
        "value" : filter["refineToggle"]
      }

      //console.log("this.filterSelected::", this.filterSelected)
      this.$store.commit("addOnFilterSelectedStore/filtersSelected",  this.filterSelected);

      //console.log("FFS: " + JSON.stringify(this.filterSelected));
      let currentQueryParams = _module.getQueryParams;
      //console.log("OTHER ONE: " + JSON.stringify(currentQueryParams));
      if (_module.filterSelected.value.length === 0) {
        delete currentQueryParams[this.filterSelected.key];
      }
      else {
        currentQueryParams[this.filterSelected.key] = this.filterSelected.value;
      }
      _module.recordsLoading = true;
      await _module.fetchMultiTagData(currentQueryParams);
      _module.recordsLoading = false;


    },
    cleanText(text) {
      text.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
      text.replace("_", " ");
      return text;
    },

    // remove (filter, queryName) {
    //   const index = this.filtersOpted.indexOf(filter.item)
    //   if (index >= 0) this.filtersOpted.splice(index, 1)
    //
    //   filter["refineToggle"] = this.filtersOpted
    //   this.filterSelected = {
    //     "key" : queryName,
    //     "value" : filter["refineToggle"]
    //   }
    //
    //   this.$store.commit("addOnFilterSelectedStore/filtersSelected",  this.filterSelected)
    //
    //   // this.map.forEach((value, key) => {
    //   //   this.map.set(key, filter["refineToggle"])
    //   //   this.$store.commit("addOnFilterSelectedStore/filtersSelected",  this.map)
    //   // });
    // },

    preSelectedFilter () {
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
            this.filtersOpted = item["value"]
            this.$store.commit("addOnFilterSelectedStore/filtersSelected",  item)
            this.$store.commit("nodeListStore/filterLists",  item)
          }

        })
      }
       */

      // ...and now the same thing from the store. The code above may be obsolete.
      // TODO: Check and deal with this.
      let _module = this;
      //console.log("FQ: " + _module.filter.filterQuery);
      Object.keys(_module.getQueryParams).forEach(function(key) {
        //console.log(key);
        if (key === _module.filter.filterQuery) {
          //console.log('match');
          //_module.filter.refineToggle = _module.getQueryParams[key];
          //_module.filterSelected[key] = _module.getQueryParams[key];
        }
      })
    }

  }
}
</script>
