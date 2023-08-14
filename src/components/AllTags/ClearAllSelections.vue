<template>
  <div
    class="d-flex align-center"
    :class="{'mb-6 mr-2 full-width utilityButton': $vuetify.breakpoint.smAndDown}"
  >
    <Tooltip :tooltip-text="tooltipText" />
    <v-btn
      :block="$vuetify.breakpoint.smAndDown"
      :disabled="!clearButtonActive"
      color="dev_color white--text"
      @click="
        clearResults()"
    >
      Clear all selections
    </v-btn>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: 'ClearAllSelections',
  components: {Tooltip},
  data(){
    return {
      tooltipText: "This will clear all filters and tags."
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getQueryParams", "getRefinedStatus", "getCurrentRegistry"]),
    clearButtonActive() {
      let _module = this;
      if (_module.getFairSharingRecords && _module.getFairSharingRecords.length > 0) {
        return true;
      }
      else if (_module.getQueryParams && Object.keys(_module.getQueryParams).length > 0) {
        return true;
      }
      else if (_module.getRefinedStatus) {
        return true;
      }
      else if (_module.getCurrentRegistry) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions('multiTagsStore', ['resetMultiTags']),
    clearResults() {
      this.resetMultiTags()
      const allSelectedTags = {
        domains: [],
        taxonomies: [],
        subjects: [],
        user_defined_tags: []
      }

      const allRecordTags = []
      this.$emit('clearAll', [allSelectedTags, allRecordTags])
    }
  }
}

</script>

<style scoped>
.utilityButton {
    max-width: 320px
}
</style>