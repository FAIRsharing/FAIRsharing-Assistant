<template>
  <v-row v-if="getRefinedStatus" class="block-category pb-5">
    <v-col cols="12">
      <v-alert type="info">
        <span v-if="getSelectionMessage">
          {{ getSelectionMessage }}
        </span>
        <span v-else>
          You've already selected <b>{{ getCurrentRegistry }}</b> records which
          will affect record counts here.
        </span>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "RefineAlert",
  computed: {
    ...mapGetters("multiTagsStore", [
      "getRefinedStatus",
      "getCurrentRegistry",
      "getSelectionMessage",
    ]),
  },
};
</script>
