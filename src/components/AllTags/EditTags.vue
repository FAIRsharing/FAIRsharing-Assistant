<template>
  <div>
    <!-- Alert -->
    <RefineAlert />
    <v-form
      id="editTags"
      ref="editTags"
      v-model="formValid"
    >
      <v-container fluid>
        <div
          class="block-category mb-5 d-flex align-center justify-space-around"
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
          <ClearAllSelections />
          <GoHome />
        </div>
        <TagsSelected />
        <!-- modal to ask users if they want to add subject agnostic records --->
        <SubjectAgnostic :search-tags-ref="searchRef" />
      </v-container>
      <SearchTags ref="searchTagsRef" />
    </v-form>
  </div>
</template>

<script>
import TagsCard from "@/components/AllTags/TagsCard.vue";
import ViewRecords from "@/components/Navigation/ViewRecordsButton.vue";
import ClearAllSelections from "@/components/Navigation/ClearAllSelections.vue"
import GoHome from "@/components/Navigation/HomeButton.vue";
import RefineAlert from "@/components/AllTags/RefineAlert.vue";
import TagsSelected from "@/components/AllTags/TagsSelected.vue";
import stringUtils from '@/utils/stringUtils';
import SearchTags from "@/components/AllTags/SearchTags.vue";
import SubjectAgnostic from "@/components/AllTags/SubjectAgnostic.vue"

export default {
  name: "EditTags",
  components: {SearchTags, TagsSelected, RefineAlert, GoHome, ViewRecords, TagsCard, ClearAllSelections, SubjectAgnostic},
  mixins: [stringUtils],
  data(){
    return {
      formValid: true,
      searchRef: {}
    }
  },
  mounted() {
    this.searchRef = this.$refs.searchTagsRef
  },
}
</script>

<style scoped>
.utilityButtons {
    max-width: 650px
}


</style>

