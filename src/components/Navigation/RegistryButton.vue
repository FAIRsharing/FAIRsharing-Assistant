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
      data-testid="returnToRegistries"
      :block="$vuetify.display.smAndDown"
      :disabled="!registryButtonActive"
      color="internal white--text primary"
      @click="returnToRegistries()"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: "RegistryButton",
  components: { Tooltip },
  data() {
    return {
      button: {
        text: "Edit registry",
        attributes: {
          elevation: "2",
          raised: true,
          color: "accent2",
        },
      },
      tooltipText: "Change your registry-specific filters",
    };
  },
  computed: {
    ...mapGetters("multiTagsStore", ["getRefinedStatus"]),

    registryButtonActive() {
      if (this.getRefinedStatus) return true;
      else return false;
    },
  },
  methods: {
    returnToRegistries() {
      let _module = this;
      _module.$router.push("/refineregistry");
    },
  },
};
</script>

<style scoped>
.utilityButton {
  max-width: 320px;
}
</style>
