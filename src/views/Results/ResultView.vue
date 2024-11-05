<template>
  <div
    class="d-flex flex-column justify-start align-stretch"
  >
    <Jumbotron />
    <div
      v-if="Object.keys(getBreadcrumbs).length > 1"
      class="mb-10 d-flex flex-row justify-space-around full-width margin-auto"
      :class="{'flex-column align-center': $vuetify.display.smAndDown}"
    >
      <Breadcrumbs />
    </div>
    <div
      v-else
      class="mb-10 utilityButtons d-flex flex-row justify-space-around full-width margin-auto"
      :class="{'flex-column align-center': $vuetify.display.smAndDown}"
    >
      <NavigateBackButton />
      <ResearchFieldsButton />
      <RegistryButton />
      <ClearAllSelections :refine-page="true" />
    </div>
    <ResultTable @is-error="noRecords" />
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Jumbotron from "@/components/Navigation/Jumbotron";
import ResultTable from "@/components/Results/ResultTable.vue"
import ResearchFieldsButton from "@/components/Navigation/ResearchFieldsButton.vue";
import ClearAllSelections from "@/components/Navigation/ClearAllSelections.vue";
import RegistryButton from "@/components/Navigation/RegistryButton.vue"
import NavigateBackButton from "@/components/Navigation/NavigateBackButton.vue";
import Breadcrumbs from "@/components/Navigation/Breadcrumbs.vue";


export default {
  name: 'ResultView',
  components: {
    Breadcrumbs,
    ResultTable,
    ClearAllSelections,
    ResearchFieldsButton,
    Jumbotron,
    RegistryButton,
    NavigateBackButton
  },
  data() {
    return{
      isError: false
    }
  },
  computed: {
    ...mapGetters('navigationStore', ["getBreadcrumbs"]),
  },
  methods:{
    /**
       * When results page is accessed directly or refreshed
        * @param {Boolean} -- value
       */
    noRecords(value) {
      if (value) this.$router.push("/99");
    },
  }
};
</script>

<style scoped lang="scss">
.utilityButtons {
  max-width: 820px
}

</style>