<template>
  <v-row
    v-if="showBanner"
  >
    <v-col
      cols="12"
    >
      <v-alert
        :type="resultCountColour()"
      >
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <span
          v-html="`There are ${getFairSharingRecords.length} ${getCurrentRegistryBold()} records matching your selection.`"
        />
        <!-- eslint-enable vue/no-v-html -->

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
          class="text-h5"
        >
          Current search results
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-darken-1"
            variant="text"
            persistent
            @click="showResultPreview = false"
          >
            Close
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <Breadcrumbs />
          <ResultTable />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-darken-1"
            variant="text"
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
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue";

export default {
  name: 'QuestionPage',
  components: {Breadcrumbs, ResultTable },
  mixins: [stringUtils],
  props: {
    showBanner: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      showResultPreview: false,
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getCurrentRegistry"]),
  },
  methods: {
    ...mapGetters('multiTagsStore', ["getQueryParams"]),
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