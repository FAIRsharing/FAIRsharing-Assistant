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
    <v-row>
      <Tooltip
        :tooltip-text="filter['tooltip']"
        class="mt-4 mr-1"
      />
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
    </v-row>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Loaders from "@/components/Loaders/Loaders.vue";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: "SwitchFilter",
  components: {Tooltip, Loaders},
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
      recordsLoading: false,
      hasBeenUsed: false,
      filtersOpted: 'null',
      filterSelectedArray: [],
      filterSelected:{
        key:"",
        value:""
      }
    }
  },
  computed:{
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
      _module.hasBeenUsed = true;
      let currentQueryParams = _module.getQueryParams;
      if (_module.filtersOpted === 'true') {
        currentQueryParams[filter['filterQuery']] = true;
      }
      else if (_module.filtersOpted === 'false') {
        currentQueryParams[filter['filterQuery']] = false;
      }
      else {
        delete currentQueryParams[filter['filterQuery']];
      }

      // TODO: Try to update query params with currentQueryParams
      
      this.recordsLoading = true;
      await _module.fetchMultiTagData(currentQueryParams);
      this.recordsLoading = false;
    },

    preSelectedFilter () {
      // TODO: Change this to look in the store.
      let _module = this;
      let existing  = _module.getQueryParams[_module.filter.filterQuery];
      if (existing) {
        _module.filtersOpted = String(existing);
      }
    },
  }
}
</script>
