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
        You've already made selections on the <b>{{ getCurrentRegistry }}</b> refinement page which will affect record counts here.
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: 'RefineAlert',
  computed: {
    ...mapGetters('multiTagsStore', ["getRefinedStatus", "getCurrentRegistry"]),
  }
}

</script>