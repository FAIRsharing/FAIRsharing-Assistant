<template>
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
</template>

<script>
import {mapGetters} from "vuex";
import addOnFilters from "@/data/addOnFilters.json"

export default {
  name: 'AddOnFilters',
  data:() => {
    return {
      switchTypeFilters: addOnFilters["switch"],
      selectTypeFilters: addOnFilters["select"],
      allFilters: [],
      addOnFilters: [...addOnFilters["switch"], ...addOnFilters["select"]],
      onlySwitch: false,
      onlySelect: false,

    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource', 'getSubject', 'getDomain']),
    switchDisplay() {
      return this.onlySelect ? 'd-none' : 'd-flex'
    },
    selectDisplay() {
      return this.onlySwitch ? 'd-none' : 'd-flex'
    }
  },
  mounted() {
    this.selectFilters()
    this.selectToggle()
  },
  methods: {
    selectFilters(){
      const prevRoute = this.$router.history._startLocation
      if(prevRoute === "/database") {
        const databaseSwitchFilters = this.switchTypeFilters.filter(({filterTypes}) => filterTypes.includes("database"))
        this.switchTypeFilters = databaseSwitchFilters
        const databaseSelectFilters = this.selectTypeFilters.filter(({filterTypes}) => filterTypes.includes("database"))
        this.selectTypeFilters = databaseSelectFilters
        this.conditionalDisplay()
      }
      else if(prevRoute === "/standards") {
        const standardsSwitchFilters = this.switchTypeFilters.filter(({filterTypes}) => filterTypes.includes("standards"))
        this.switchTypeFilters = standardsSwitchFilters
        const standardsSelectFilters = this.selectTypeFilters.filter(({filterTypes}) => filterTypes.includes("standards"))
        this.selectTypeFilters = standardsSelectFilters
        this.conditionalDisplay()
      }
      else if(prevRoute === "/policies") {
        const policiesSwitchFilters = this.switchTypeFilters.filter(({filterTypes}) => filterTypes.includes("policies"))
        this.switchTypeFilters = policiesSwitchFilters
        const policiesSelectFilters = this.selectTypeFilters.filter(({filterTypes}) => filterTypes.includes("policies"))
        this.selectTypeFilters = policiesSelectFilters
        this.conditionalDisplay()

      }
    },
    selectToggle() {
      let map = new Map();
      for (let filter of this.addOnFilters) {
        map.set(`${filter["filterQuery"]}`, `${filter["refineToggle"]}`)
      }
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