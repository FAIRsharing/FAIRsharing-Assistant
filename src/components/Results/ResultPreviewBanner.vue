<template>
  <v-row
    v-if="Object.keys(getQueryParams).length >= 1"
  >
    <v-col
      cols="12"
    >
      <v-alert
        density="compact"
        :type="resultCountColour()"
        variant="tonal"
      >
        There are {{ getFairSharingRecords.length }} {{ getCurrentRegistryBold }} records matching your selection.
        <v-btn
          v-if="resultCountColour() !== 'error'"
          class="preview-results"
          @click="showResultPreview = true"
        >
          Preview
        </v-btn>
      </v-alert>
    </v-col>
    <v-dialog
      v-model="showResultPreview"
      persistent
    >
      <v-card>
        <v-card-title
          class="headline"
        >
          Current search results
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            persistent
            @click="showResultPreview = false"
          >
            Close
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <ResultTable />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            persistent
            @click="showResultPreview = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import ResultTable from "@/components/Results/ResultTable.vue";
import stringUtils from "@/utils/stringUtils";
import {mapGetters} from "vuex";

export default {
  name: 'QuestionPage',
  components: { ResultTable },
  mixins: [stringUtils],
  data: () => {
    return {
      showResultPreview: false,
      show: false
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getCurrentRegistry", "getQueryParams"])
  },
  methods: {
    resultCountColour() {
      if (this.getFairSharingRecords.length > 10) {
        return "success";
      }
      else if (this.getFairSharingRecords.length > 0 && this.getFairSharingRecords.length <= 10) {
        return "warning";
      }
      return "error";
    },
    getCurrentRegistryBold() {
      if (this.getCurrentRegistry) {
        return `<b>${this.getCurrentRegistry}</b>`;
      }
      return '';
    }
  }
}

</script>

<style>
.preview-results {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>