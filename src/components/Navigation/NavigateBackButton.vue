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
      data-testid="navigateToPrevious"
      :block="$vuetify.display.smAndDown"
      color="dev_color text-white"
      @click="navigateToPrevious($route.path)"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: "NavigateBack",
  components: { Tooltip },
  data() {
    return {
      button: {
        text: "Previous Page",
        attributes: {
          elevation: "2",
          raised: true,
          color: "accent2",
        },
      },
      tooltipText: "Return to the last page you were viewing",
    };
  },
  computed: {
    ...mapGetters("navigationStore", ["getPreviousLocation"]),
  },
  methods: {
    navigateToPrevious(current) {
      let previous = this.getPreviousLocation;
      this.$store.commit("navigationStore/setNavigationState", current);
      this.$router.push({ path: previous });
    },
  },
};
</script>

<style scoped>
.utilityButton {
  max-width: 320px;
}
</style>
