<template>
  <v-container class="ma-0">
    <div
      v-for="(filter) in addOnFilters"
      :key="filter['filterQuery']"
    >
      <v-switch
        v-if="filter['switch']"
        v-model="filter['refineToggle']"
        class="d-inline-block mr-2"
        :label="filter['filterName']"
        inset
        :value="filter['refineToggle']"
        @change="selectToggle()"
      />
      <v-select
        v-if="filter['select']"
        v-model="filter['refineToggle']"
        :items="filter['options']"
        :label="filter['filterName']"
        class="optionsList"
        @change="selectToggle()"
      />
    </div>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";
import addOnFilters from "@/data/addOnFilters.json"

export default {
  name: 'AddOnFilters',
  data:() => {
    return {
      addOnFilters: addOnFilters,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource', 'getSubject', 'getDomain']),
  },
  mounted() {
    this.selectFilters()
    this.selectToggle()
  },
  methods: {
    selectFilters(){
      const prevRoute = this.$router.history._startLocation
      if(prevRoute === "/database") {
        const databaseFilters = this.addOnFilters.filter(({filterTypes}) => filterTypes.includes("database"))
        this.addOnFilters = databaseFilters
      }
      else if(prevRoute === "/standards") {
        const standardsFilters = this.addOnFilters.filter(({filterTypes}) => filterTypes.includes("standards"))
        this.addOnFilters = standardsFilters
      }
      else if(prevRoute === "/policies") {
        const policiesFilters = this.addOnFilters.filter(({filterTypes}) => filterTypes.includes("policies"))
        this.addOnFilters = policiesFilters
      }
    },

    selectToggle() {
      let map = new Map();
      for (let filter of this.addOnFilters) {
        map.set(`${filter["filterQuery"]}`, `${filter["refineToggle"]}`)
      }
      this.$store.commit("addOnFilterSelectedStore/filtersSelected", map)
    }
  }
};
</script>