<template>
  <div
    class="d-flex align-center"
    :class="{
      'mb-6 mr-2 full-width utilityButton': $vuetify.display.smAndDown,
    }"
  >
    <Tooltip :tooltip-text="tooltipText" />
    <v-btn
      v-bind="button['attributes']"
      data-testid="showResults"
      :block="$vuetify.display.smAndDown"
      :disabled="!resultsButtonActive"
      color="internal text-white primary"
      @click="showResults()"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: "ViewRecordsButton",
  components: { Tooltip },
  data() {
    return {
      button: {
        text: "View Records",
        attributes: {
          elevation: "2",
          raised: true,
          color: "accent2",
        },
      },
      tooltipText:
        "See the list of FAIRsharing records matching your selections below",
    };
  },
  computed: {
    ...mapGetters("multiTagsStore", ["getFairSharingRecords"]),
    resultsButtonActive() {
      if (this.getFairSharingRecords && this.getFairSharingRecords.length)
        return true;
      else return false;
    },
  },
  methods: {
    showResults() {
      let _module = this;
      _module.$router.push("/results");
    },
  },
};
</script>

<style scoped>
.utilityButton {
  max-width: 320px;
}
</style>
