<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-fade-transition v-if="recordsLoading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <!-- Alert -->
    <RefineAlert />
    <v-form
      id="editTags"
      ref="editTags"
      v-model="formValid"
    >
      <v-container fluid>
        <div
          class="block-category pb-5 d-flex align-center justify-space-around"
          :class="{'flex-column': $vuetify.breakpoint.smAndDown}"
        >
          <!-- Standard card -->
          <TagsCard
            registry="Standard"
          />
          <!-- Database card -->
          <TagsCard
            registry="Database"
          />
          <!-- Policy card -->
          <TagsCard
            registry="Policy"
          />
          <!-- Collection card -->
          <TagsCard
            registry="Collection"
          />
        </div>
        <!-- end of result cards -->
        <div
          class="utilityButtons d-flex flex-row justify-space-around my-6 full-width margin-auto"
          :class="{'flex-column align-center': $vuetify.breakpoint.smAndDown}"
        >
          <ViewRecords />
          <ClearAllSelections @clearAll="clearAllResults" />
          <GoHome @startOver="goHome" />
        </div>
        <TagsSelected />
      </v-container>
      <SearchTags />
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Loaders from "@/components/Loaders/Loaders.vue";
import TagsCard from "@/components/AllTags/TagsCard.vue";
import ViewRecords from "@/components/AllTags/ViewRecords.vue";
import ClearAllSelections from "@/components/AllTags/ClearAllSelections.vue"
import GoHome from "@/components/AllTags/GoHome.vue";
import RefineAlert from "@/components/AllTags/RefineAlert.vue";
import TagsSelected from "@/components/AllTags/TagsSelected.vue";
import stringUtils from '@/utils/stringUtils';
import SearchTags from "@/components/AllTags/SearchTags.vue";

export default {
  name: "EditTags",
  components: {SearchTags, TagsSelected, RefineAlert, GoHome, ViewRecords, Loaders, TagsCard, ClearAllSelections},
  mixins: [stringUtils],
  data(){
    return {
      formValid: true,
      recordsLoading: false,
      selectedTags: {
        domains: [],
        taxonomies: [],
        subjects: [],
        user_defined_tags: []
      },
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords",
      "getQueryParams",
      "getSelectedTags"
    ]),
  },
  methods: {
    ...mapActions('multiTagsStore', ['fetchMultiTagData', 'resetMultiTags']),

    clearAllResults(allBlankData) {
      this.selectedTags = allBlankData[0]
      this.recordTags = allBlankData[1];
    },
    goHome(allBlankData) {
      this.selectedTags = allBlankData[0]
      this.recordTags = allBlankData[1];
    },

  },
}
</script>

<style scoped>
.utilityButtons {
    max-width: 650px
}

</style>

