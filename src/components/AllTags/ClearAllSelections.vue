<template>
  <div>
    <v-tooltip right>
      <template #activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          small
          class="grey--text mr-1"
          v-on="on"
        >
          fa-question-circle
        </v-icon>
      </template>
      <span> This will clear all filters and tags. </span>
    </v-tooltip>
    <v-btn
      :disabled="!clearButtonActive"
      color="dev_color white--text"
      class="mr-10"
      @click="clearResults()"
    >
      Clear all selections
    </v-btn>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'ClearAllSelections',
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