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
              class="bg-blue text-white text-capitalize"
            >
              {{ cleanText(data.item.title) }}
            </v-chip>
          </template>
        </v-select>
      </v-col>
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
    cleanText(string) {
      if (typeof string === "string") {
        if (string.includes("_")) {
          return string.replace(/_/g, " ");
        }
      }
      return string;
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
