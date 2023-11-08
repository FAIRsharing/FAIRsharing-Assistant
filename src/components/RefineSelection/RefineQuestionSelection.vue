<template>
  <v-container
    fluid
    class="wrapperClass d-flex flex-column align-content-stretch"
  >
    <v-fade-transition v-if="loading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <!-- how many results so far? -->
    <ResultPreviewBanner />
    <!-- breadcrumb trail -->
    <Breadcrumbs />
  </v-container>
</template>

<script>
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue";
import Loaders from "@/components/Loaders/Loaders.vue";
import ResultPreviewBanner from "@/components/Results/ResultPreviewBanner.vue";
import stringUtils from "@/utils/stringUtils";
import {mapGetters} from "vuex";

export default {
  name: 'RefineQuestionSelection',
  components: {ResultPreviewBanner, Loaders, Breadcrumbs},
  mixins: [stringUtils],
  data: () => {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getCurrentRegistry", "getQueryParams"])
  },
  methods: {

  }
}
</script>

<style>

</style>