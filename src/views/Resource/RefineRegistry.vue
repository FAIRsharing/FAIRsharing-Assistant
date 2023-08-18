<template>
  <div>
    <Jumbotron />
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
      <v-row
        class="block-category pb-5"
      >
        <v-col
          class="text-center"
        >
          <ViewRecordsButton />
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                small
                class="grey--text mr-1"
                v-on="on"
              >
                fa-question-circle
              </v-icon>
            </template>
            <span> Refine your choice of scientific field. </span>
          </v-tooltip>
          <v-btn
            :disabled="!tagButtonActive"
            color="internal white--text"
            class="mr-10"
            @click="returnToTags()"
          >
            Refine tags
          </v-btn>
          <ClearAllSelections :refine-page="true" />
          <GoHome />
        </v-col>
      </v-row>
      <v-row
        class="block-category pb-5"
      >
        <p>Below, you can select what sort of <b>{{ getCurrentRegistry }}</b> record you need.</p>
        <p
          v-if="getCurrentRegistry === 'Policy'"
        >
          Please note that curation is still in progress for our policies, and some search filters below might not give the expected result.
        </p>
      </v-row>
      <AddOnFilters @filterSource="capitaliseText(getQueryParams['fairsharingRegistry'][0], null)" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Jumbotron from "@/components/Navigation/Jumbotron";
import AddOnFilters from "@/components/Others/AddOnFilters.vue";
import ResourceCard from "@/components/Others/ResourceCard.vue";
import registryName from "@/utils/registryName";
import SelectedTags from "@/components/Others/SelectedTags.vue";
import registryIcons from "@/utils/registryIcon";
import ViewRecordsButton from "@/components/Navigation/ViewRecordsButton.vue"
import ClearAllSelections from "@/components/Navigation/ClearAllSelections.vue";
import GoHome from "@/components/Navigation/GoHome.vue";

export default {
  name: 'RefineRegistry',
  components: {
    GoHome,
    ClearAllSelections,
    SelectedTags,
    ResourceCard,
    AddOnFilters,
    Jumbotron,
    ViewRecordsButton
  },
  data:() => {
    return {
      recordsLoading: false,
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
    tagButtonActive() {
      return true;
    },
  },
  async mounted() {
    /*
        console.log(JSON.stringify(this.getQueryParams));
        console.log(JSON.stringify(this.getFairSharingRecords));
         */
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
    ...mapActions('multiTagsStore', ['fetchMultiTagData', 'resetMultiTags']),
    async getData() {

    },
    capitaliseText(text, type) {
      if (type === null || type === 'taxonomies') {
        // Upper case for first character only.
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      }
      else {
        // Upper case for first letter of each word.
        return text.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
      }
    },
    returnToTags() {
      this.$router.push('/researchfields');
    },
  }
};
</script>

