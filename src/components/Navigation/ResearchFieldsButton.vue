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
      data-testid="returnToTags"
      :disabled="!tagButtonActive"
      :block="$vuetify.display.smAndDown"
      color="primary white--text"
      @click="returnToTags()"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import Tooltip from "@/components/Others/Tooltip.vue";
import { mapGetters } from "vuex";

export default {
  name: "ResearchFieldsButton",
  components: { Tooltip },
  data() {
    return {
      button: {
        text: "Edit tags",
        attributes: {
          elevation: "2",
          raised: true,
          color: "primary",
        },
      },
      tooltipText: "Refine your choice of scientific field",
    };
  },
  computed: {
    ...mapGetters("multiTagsStore", ["getFairSharingRecords"]),
    tagButtonActive() {
      if (this.getFairSharingRecords && this.getFairSharingRecords.length > 0)
        return true;
      else return false;
    },
  },

  methods: {
    returnToTags() {
      this.$router.push("/researchfields");
    },
  },
};
</script>

<style scoped>
.utilityButton {
  max-width: 320px;
}
</style>
