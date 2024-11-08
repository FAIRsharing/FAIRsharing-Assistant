<template>
  <div class="px-md-10 pa-5 mb-8">
    <div
      class="mb-5 d-flex flex-row"
      :class="{'flex-column align-center': $vuetify.display.smAndDown}"
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
      :class="{'flex-column align-center': $vuetify.display.smAndDown}"
    >
      <ViewRecordsButton />
      <ResearchFieldsButton />
      <ClearAllSelections :refine-page="true" />
      <GoHome />
    </div>
    <div
      class="mb-5"
    >
      <!-- help text -->
      <v-btn
        color="info"
        class="mb-2 ml-2"
        :disabled="help"
        @click="showHelp()"
      >
        Show help
      </v-btn>
      <!-- help -->
      <v-dialog
        :model-value="help"
        width="auto"
      >
        <v-card class="py-4 px-6">
          <v-card-title>
            About this page
          </v-card-title>
          <!-- This html is from a safe source -->
          <!-- eslint-disable vue/no-v-html -->
          <v-card-text>
            <!-- because javascript doesn't allow line breaks in text -->
            <span
              v-html="helpText.refinement.join('\n')"
            />
          </v-card-text>
          <!-- eslint-enable vue/no-v-html -->
          <div>
            <v-btn
              color="primary"
              @click="hideHelp()"
            >
              Close
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
      <!-- end of help text -->
      <p>Below, you can select what sort of <strong>{{ getCurrentRegistry }}</strong> record you need.</p>
      <p
        v-if="getCurrentRegistry === 'Policy'"
      >
        Please note that curation is still in progress for our policies, and some search filters below might not give the expected result.
      </p>
    </div>
    <p>
      Some text will go here to explain what's going on with the filters below, perhaps linking to Gitbook.
    </p>
    <AddOnFilters @filter-source="capitaliseText(getQueryParams['fairsharingRegistry'][0], null)" />
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
import helpDialogs from "@/data/helpDialogs.json"

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
      help: false,
      helpText: helpDialogs
    }
  },
  computed:{
    ...mapGetters("multiTagsStore", ['getQueryParams', 'getFairSharingRecords', 'getCurrentRegistry']),
    recordsAvailable() {
      if (Array.isArray(this.getFairSharingRecords) && this.getFairSharingRecords.length === 0) {
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
    showHelp() {
      this.help = true;
    },
    hideHelp() {
      this.help = false;
    }
  }
};
</script>

<style scoped>
.utilityButtons {
    max-width: 820px
}

</style>
