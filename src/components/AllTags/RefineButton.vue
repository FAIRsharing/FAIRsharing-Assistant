<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div
    class="d-flex align-center justify-center"
  >
    <Tooltip :tooltip-text="tooltipText" />
    <v-btn
      class="px-0"
      color="primary"
      :disabled="count <= 0"
      text
      @click="makeChoice()"
    >
      Refine {{ whatToRefine[choice] }}
    </v-btn>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import recordTypeData from "@/data/recordTypeData.json";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: 'RefineButton',
  components: {Tooltip},
  // TODO: Passing in these props fails to do what's required.
  props: {
    link: {
      default: '/',
      type: String
    },
    choice: {
      default: 'Database',
      type: String
    },
    count: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      recordTypes: recordTypeData,
      whatToRefine: {
        'Database': 'databases',
        'Standard': 'standards',
        'Policy': 'policies',
        'Collection': 'collections'
      },
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getQueryParams"]),
    tooltipText() {
      return `Choose further refinements to narrow down your choice of ${this.choice}`
    }
  },
  methods: {
    // This passes the fairsharingRegistry parameter to the multiTagFilter when moving to the refine screen
    makeChoice() {
      let _module = this;
      let queryParams = JSON.parse(JSON.stringify(_module.getQueryParams));
      queryParams['fairsharingRegistry'] = [ _module.choice.toLowerCase() ];
      if (!queryParams['recordType']) {
        queryParams['recordType'] = _module.getTypeArray(_module.choice);
      }
      _module.$store.commit('multiTagsStore/setQueryParams', queryParams);
      _module.$store.commit('multiTagsStore/setCurrentRegistry', _module.choice);
      _module.$router.push(_module.link);
    },
    getTypeArray(registry) {
      return this.recordTypes[registry].map(item => item.value);
    }
  }
}

</script>