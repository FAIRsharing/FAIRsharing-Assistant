<template>
  <v-row v-if="showBanner">
    <v-col cols="12">
      <v-alert :type="resultCountColour()">
        There are {{getFairSharingRecords.length}} <span class="font-weight-bold">{{getCurrentRegistryBold()}}</span> records matching your selection.
        <v-btn
          v-if="resultCountColour() !== 'error'"
          class="preview-results"
          @click="showResultPreview = true"
        >
          Preview
        </v-btn>
      </v-alert>
    </v-col>
    <v-dialog v-model="showResultPreview" persistent>
      <v-card>
        <div class="d-flex align-center position-relative">
          <v-card-title class="text-h5 mx-auto my-0">
            Current search results
          </v-card-title>
          <v-btn
            class="position-absolute right-0 top-0 pa-0"
            persistent
            variant="text"
            @click="showResultPreview = false"
          >
            <template #append>
              <v-icon icon="fa fa-xmark fa-solid" size="35" />
            </template>
          </v-btn>
        </div>
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
import { mapGetters } from "vuex";
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue";

export default {
  name: "ResultPreviewBanner",
  components: { Breadcrumbs, ResultTable },
  mixins: [stringUtils],
  props: {
    showBanner: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      showResultPreview: false,
    };
  },
  computed: {
    ...mapGetters("multiTagsStore", [
      "getFairSharingRecords",
      "getCurrentRegistry",
    ]),
  },
  methods: {
    ...mapGetters("multiTagsStore", ["getQueryParams"]),
    resultCountColour() {
      if (this.getFairSharingRecords.length > 10) {
        return "success";
      }
      else if (
        this.getFairSharingRecords.length > 0 &&
        this.getFairSharingRecords.length <= 10
      ) {
        return "warning";
      }
      return "error";
    },
    getCurrentRegistryBold() {
      if (this.getCurrentRegistry) {
        return this.getCurrentRegistry;
      }
      return "";
    },
  },
};
</script>

<style>
.preview-results {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
