<template>
  <div>
    <v-switch
      ref="filterSelect"
      v-model="filtersOpted"
      class="d-inline-block mr-2"
      :label="filter['filterName']"
      inset
      @change="selectToggle(filter)"
    />
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import currentPath from "@/utils/Others/currentPath";

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
      filtersOpted: false,
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
      //console.log("this.filtersOpted::", this.filtersOpted)
      filter["refineToggle"] = this.filtersOpted
      this.filterSelected = {
        "key" : filter["filterQuery"],
        "value" : filter["refineToggle"] ? [filter["refineToggle"]] : []
      }
      this.$store.commit("addOnFilterSelectedStore/filtersSelected",  this.filterSelected)
    },

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
            this.filtersOpted = item["value"][0]
            this.$store.commit("addOnFilterSelectedStore/filtersSelected",  item)
            this.$store.commit("nodeListStore/filterLists",  item)
          }
        })
      }
    }
  }
}
</script>
