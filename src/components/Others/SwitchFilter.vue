<template>
  <div>
    <v-fade-transition v-if="recordsLoading">
      <div>
        <v-overlay
          v-model="recordsLoading"
          class="align-center justify-center"
          :absolute="false"
          opacity="0.8"
        >
          <Loaders />
        </v-overlay>
      </div>
    </v-fade-transition>
    <v-row>
      <v-col
        cols="12"
        class="d-flex align-top"
      >
        <Tooltip
          :tooltip-text="filter['tooltip']"
          class="mr-n2"
          style="margin-top:1px"
        />
        <v-radio-group
          v-model="filtersOpted"
          :label="filter['filterName']"
          color="primary"
          @update:model-value="selectToggle(filter)"
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
      </v-col>
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
      /* v8 ignore start */
      if (existing) {
        _module.filtersOpted = String(existing);
      }
      /* v8 ignore stop */
    },
  }
}
</script>
