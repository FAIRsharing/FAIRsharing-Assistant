<template>
  <div>
    <v-select
      ref="filterSelect"
      v-model="filtersOpted"
      :items="filter['options']"
      :label="filter['filterName']"
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
import {mapGetters} from "vuex";
import currentPath from "@/utils/Others/currentPath";

export default {
  name: "SelectFilter",
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
    currentRouteQuery() {
      return this.$route.query;
    },
  },

  mounted() {
    this.preSelectedFilter()
  },

  methods: {
    selectToggle(filter) {

      filter["refineToggle"] = this.filtersOpted
      this.filterSelected = {
        "key" : filter["filterQuery"],
        "value" : filter["refineToggle"]
      }

      console.log("this.filterSelected::", this.filterSelected)
      this.$store.commit("addOnFilterSelectedStore/filtersSelected",  this.filterSelected)
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
    }
  }
}
</script>
