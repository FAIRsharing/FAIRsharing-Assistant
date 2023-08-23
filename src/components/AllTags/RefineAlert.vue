<template>
  <v-row
    v-if="getRefinedStatus"
    class="block-category pb-5"
  >
    <v-col
      cols="12"
    >
      <v-alert
        density="compact"
        type="info"
        variant="tonal"
      >
        <!-- This html is from a safe source -->
        <!-- eslint-disable vue/no-v-html -->
        <span
          v-if="getSelectionMessage"
          v-html="getSelectionMessage"
        >
        </span>
        <span
          v-else
        >

          You've already made selections on the <b>{{ getCurrentRegistry }}</b> refinement page which will affect record counts here.
        </span>
        <!-- eslint-enable vue/no-v-html -->
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: 'RefineAlert',
  computed: {
    ...mapGetters('multiTagsStore', ["getRefinedStatus", "getCurrentRegistry", "getSelectionMessage"]),
  }
}

</script>