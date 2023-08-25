<template>
  <div class="px-md-10 pa-5 mb-8">
    <div
      class="mb-5 d-flex flex-row"
      :class="{'flex-column align-center': $vuetify.breakpoint.smAndDown}"
    >
      <ResourceCard
        class="mb-5"
        :registry-icon="registryIcons(getCurrentRegistry)"
        :registry-name="registryName(getCurrentRegistry)"
        :records-count="recordsAvailable"
      />
      <SelectedTags :refine-page="true" />
    </div>
    <div
      class="utilityButtons d-flex flex-row justify-space-around my-6 full-width margin-auto"
      :class="{'flex-column align-center': $vuetify.breakpoint.smAndDown}"
    >
      <ViewRecordsButton />
      <ResearchFieldsButton />
      <ClearAllSelections :refine-page="true" />
      <GoHome />
    </div>
    <div
      class="mb-5"
    >
      <p>Below, you can select what sort of <strong>{{ getCurrentRegistry }}</strong> record you need.</p>
      <p
        v-if="getCurrentRegistry === 'Policy'"
      >
        Please note that curation is still in progress for our policies, and some search filters below might not give the expected result.
      </p>
    </div>
    <AddOnFilters @filterSource="capitaliseText(getQueryParams['fairsharingRegistry'][0], null)" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddOnFilters from "@/components/Others/AddOnFilters.vue";
import ResourceCard from "@/components/Others/ResourceCard.vue";
import registryName from "@/utils/registryName";
import SelectedTags from "@/components/Others/SelectedTags.vue";
import registryIcons from "@/utils/registryIcon";
import ViewRecordsButton from "@/components/Navigation/ViewRecordsButton.vue"
import ClearAllSelections from "@/components/Navigation/ClearAllSelections.vue";
import GoHome from "@/components/Navigation/HomeButton.vue";
import ResearchFieldsButton from "@/components/Navigation/ResearchFieldsButton.vue"
import stringUtils from "@/utils/stringUtils";

export default {
  name: 'RefineSelection',
  components: {
    GoHome,
    ClearAllSelections,
    SelectedTags,
    ResourceCard,
    AddOnFilters,
    ViewRecordsButton,
    ResearchFieldsButton
  },
  mixins: [stringUtils],
  data:() => {
    return {
      recordTypes: {},
    }
  },
  computed:{
    ...mapGetters("multiTagsStore", ['getQueryParams', 'getFairSharingRecords', 'getCurrentRegistry']),
    recordsAvailable() {
      if (!this.getFairSharingRecords) {
        return 0;
      }
      return this.getFairSharingRecords.filter(x => x.registry === this.getCurrentRegistry).length
    },
  },
  mounted() {
    // If a user has come here then they've set the refinement status by choosing a registry
    if (!this.getCurrentRegistry) {
      this.$store.commit('multiTagsStore/setRefinedStatus', false);
      this.$router.push('/researchfields');
    }
    this.$store.commit('multiTagsStore/setRefinedStatus', true);
  },
  methods: {
    registryName,
    registryIcons,
  }
};
</script>

<style scoped>
.utilityButtons {
    max-width: 820px
}

</style>
