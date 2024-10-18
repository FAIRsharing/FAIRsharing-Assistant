<template>
  <div>
    <v-fade-transition v-if="loading">
      <div>
        <v-overlay
          v-model="loading"
          class="align-center justify-center"
          :absolute="false"
          opacity="0.8"
        >
          <Loaders />
        </v-overlay>
      </div>
    </v-fade-transition>
    <div class="mt-5 mx-9">
      <div
        class="filterWrapper d-flex flex-row align-stretch my-0 mx-auto full-width"
        :class="{'flex-column':$vuetify.display.smAndDown}"
      >
        <div
          class="switchWrapper flex-column full-width"
          :class="switchDisplay"
        >
          <v-checkbox
            v-for="(field, index) in recordTypes[getCurrentRegistry]"
            :key="field.value + '-' + index"
            :ref="field.value"
            v-model="typeSelected"
            :value="field.value"
            color="primary"
            :label="field.label"
            @update:model-value="checkCheckbox()"
          >
            <template #prepend>
              <Tooltip
                :tooltip-text="field.tooltip "
                class="mr-n4"
                style="margin-top:-3px"
              />
            </template>
          </v-checkbox>
        </div>
        <div
          class="flex-column full-width"
          :class="switchDisplay"
        >
          <div
            v-for="(filter) in switchTypeFilters"
            :key="filter['filterQuery']"
          >
            <SwitchFilter :filter="filter" />
          </div>
        </div>
        <div
          class="flex-column full-width"
          :class="selectDisplay"
        >
          <div
            v-for="(filter) in selectTypeFilters"
            :key="filter['filterQuery']"
          >
            <SelectFilter
              :filter="filter"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import addOnFilters from "@/data/addOnFilters.json"
import recordTypeData from "@/data/recordTypeData.json";
import Loaders from "@/components/Loaders/Loaders.vue";
import currentPath from "@/utils/currentPath"
import SelectFilter from "@/components/Others/SelectFilter.vue"
import SwitchFilter from "@/components/Others/SwitchFilter.vue"
import Tooltip from "@/components/Others/Tooltip.vue";
export default {
  name: 'AddOnFilters',
  components: {
    Tooltip,
    Loaders,
    SelectFilter,
    SwitchFilter,
  },

  data:() => {
    return {
      loading: false,
      prevRoute: null,
      topResult: '',
      childResult: '',
      switchTypeFilters: addOnFilters["switch"],
      selectTypeFilters: addOnFilters["select"],
      allFilters: [],
      addOnFilters: [...addOnFilters["switch"], ...addOnFilters["select"]],
      onlySwitch: false,
      onlySelect: false,
      allowedRegistries: ['Database', 'Standard', 'Policy', 'Collection'],
      map: new Map(),
      recordTypes: recordTypeData,
      typeSelected: [],
      allowedTypes: [
        "repository",
        "knowledgebase",
        "model_and_format",
        "metric",
        "terminology_artefact",
        "reporting_guideline",
        "identifier_schema",
        "journal",
        "society",
        "project",
        "institution",
        "collection",
        "journal_publisher",
        "knowledgebase_and_repository",
        "funder"
      ]
    }
  },

  computed:{
    ...mapGetters('multiTagsStore', ["getQueryParams", "getCurrentRegistry"]),
    switchDisplay() {
      return this.onlySelect ? 'd-none' : 'd-flex'
    },
    selectDisplay() {
      return this.onlySwitch ? 'd-none' : 'd-flex'
    },
    currentRouteQuery() {
      return this.$route.query;
    }
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      let _module = this;
      await _module.resetFiltersOnLoad()
      await _module.readRegAndTypeFilterParams();
      await _module.selectFilters();
      if (_module.getQueryParams['recordType']) {
        _module.getQueryParams['recordType'].forEach(function(type) {
          _module.typeSelected.push(type)
        })
      }
      this.loading = false
    })
  },
  methods: {
    ...mapActions('multiTagsStore', ['fetchMultiTagData']),
    async checkCheckbox() {
      // TODO: Modify queryParams and trigger query.
      // TODO: Ensure at least one box is selected.
      let _module = this
      let params = JSON.parse(JSON.stringify(_module.getQueryParams));
      params['recordType'] = _module.typeSelected;
      _module.$store.commit('multiTagsStore/setQueryParams', params);
      _module.loading = true;
      await _module.fetchMultiTagData(params);
      _module.loading = false;
    },
    resetFiltersOnLoad() {
      let _module = this;
      [_module.switchTypeFilters, _module.selectTypeFilters].forEach(group => {
        group.forEach(filter => {
          if (typeof filter["refineToggle"] === "boolean") filter["refineToggle"] = false
          filter["refineToggle"] = null
        })

      })
    },
    async readRegAndTypeFilterParams() {
      let _module = this;
      let params = currentPath(this.currentRouteQuery);
      Object.keys(params).forEach(key => {
        if (key === 'registry') {
          if (_module.allowedRegistries.indexOf(params[key]) > -1) {
            _module.topResult = params[key];
          }
        }
        if (key === 'record_type') {
          if (_module.allowedTypes.indexOf(params[key]) > -1) {
            _module.childResult = params[key];
          }
        }
      })
    },
    selectFilters(){
      const prevRoute = localStorage.getItem("pageName");
      let selectedRegistry = this.topResult;
      if (this.getQueryParams['fairsharingRegistry']) {
        selectedRegistry = this.getQueryParams['fairsharingRegistry'][0] || 'none';
      }

      //When previous page or selection link is related to 'Database'
      if(prevRoute === "DatabaseView" || selectedRegistry === 'database') {
        this.conditionalFilters("database")
      }
      //When previous page or selection link is related to 'Standard'
      else if(prevRoute === "StandardsView" || selectedRegistry === 'standard') {
        this.conditionalFilters("standards")
      }
      //When previous page or selection link is related to 'Policy'
      else if(prevRoute === "PoliciesView" || selectedRegistry === 'policy') {
        this.conditionalFilters("policies")
      }
    },
    conditionalDisplay() {
      if (!this.switchTypeFilters?.length && this.selectTypeFilters?.length) {
        this.onlySelect = true
      }
      else if (this.switchTypeFilters?.length && !this.selectTypeFilters?.length) {
        this.onlySwitch = true
      }
    },
    conditionalFilters(registry) {
      const registrySwitchFilters = this.switchTypeFilters.filter(({filterTypes}) => filterTypes.includes(registry))
      this.switchTypeFilters = registrySwitchFilters
      const registrySelectFilters = this.selectTypeFilters.filter(({filterTypes}) => filterTypes.includes(registry))
      this.selectTypeFilters = registrySelectFilters
      this.conditionalDisplay()
    },
  }
};
</script>

<style scoped lang="scss">
.filterWrapper {
  justify-content: space-evenly;
  max-width: 1500px;
}
</style>