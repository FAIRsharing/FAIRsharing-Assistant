<template>
  <div
    class="d-flex flex-column justify-start align-stretch"
  >
    {{ getQueryParams }}
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'QuerySummary',
  computed: {
    ...mapGetters('multiTagsStore', ["getQueryParams"]),
  }
}
</script>