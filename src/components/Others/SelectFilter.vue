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
        class="mt-5 mr-1"
      />
      <v-select
        ref="filterSelect"
        v-model="filtersOpted"
        :items="filter['options']"
        :label="cleanText(filter['filterName'])"
        clearable
        multiple
        chips
        return-object
        @update:model-value="selectToggle(filter)"
      >
        <template #chip="data">
          <v-chip
            v-bind="data.attrs"
            :model-value="data.selected"
            class="bg-blue text-white"
          >
            {{ data.item }}
          </v-chip>
        </template>
      </v-select>
    </v-row>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import Loaders from "@/components/Loaders/Loaders.vue";
import Tooltip from "@/components/Others/Tooltip.vue"

export default {
  name: "SelectFilter",
  components: { Loaders, Tooltip },
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
      filtersOpted:[],
      recordsLoading: false,
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
      filter["refineToggle"] = this.filtersOpted
      _module.filterSelected = {
        "key" : filter["filterQuery"],
        "value" : filter["refineToggle"]
      }

      // this.$store.commit("addOnFilterSelectedStore/filtersSelected",  this.filterSelected);

      let currentQueryParams = _module.getQueryParams;
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

    preSelectedFilter () {
      let _module = this;
      Object.keys(_module.getQueryParams).forEach(function(key) {
        if (key === _module.filter.filterQuery) {
          _module.getQueryParams[key].forEach(function(value) {
            _module.filtersOpted.push(value);
          })
        }
      })
    }

  }
}
</script>
