<template>
  <div
    class="d-flex flex-column justify-start align-stretch"
  >
    <Jumbotron />
    <div
      class="mb-10 utilityButtons d-flex flex-row justify-space-around full-width margin-auto"
      :class="{'flex-column align-center': $vuetify.breakpoint.smAndDown}"
    >
      <NavigateBackButton />
      <ResearchFieldsButton />
      <RegistryButton />
      <ClearAllSelections :refine-page="true" />
    </div>
    <ResultTable @isError="noRecords" />
  </div>
</template>

<script>
import Jumbotron from "@/components/Navigation/Jumbotron";
import ResultTable from "@/components/Results/ResultTable.vue"
import ResearchFieldsButton from "@/components/Navigation/ResearchFieldsButton.vue";
import ClearAllSelections from "@/components/Navigation/ClearAllSelections.vue";
import RegistryButton from "@/components/Navigation/RegistryButton.vue"
import NavigateBackButton from "@/components/Navigation/NavigateBackButton.vue";



export default {
  name: 'ResultView',
  components: {
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
  methods:{
    /**
       * When results page is accessed directly or refreshed
        * @param {Boolean} -- value
       */
    noRecords(value) {
      if (value) this.$router.push("/")
    },
  }
};
</script>

<style scoped lang="scss">
.utilityButtons {
  max-width: 820px
}

</style>