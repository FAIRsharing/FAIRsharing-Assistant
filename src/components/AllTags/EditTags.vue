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
        <v-col cols="12">
          <v-card
            v-if="showAgnosticModal"
            color="#385F73"
            theme="dark"
          >
            <v-card-title
              class="text-h5"
              style="color: white"
            >
              There aren't any results for some registries...
            </v-card-title>

            <v-card-subtitle
              style="color: white"
            >
              Would you like to search for subject-agnostic resources as well?
            </v-card-subtitle>

            <v-card-actions>
              <v-btn>
                Yes please
              </v-btn>
              <v-btn>
                No thanks
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-container>
      <SearchTags />
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
import {mapGetters} from "vuex";

export default {
  name: "EditTags",
  components: {SearchTags, TagsSelected, RefineAlert, GoHome, ViewRecords, TagsCard, ClearAllSelections},
  mixins: [stringUtils],
  data(){
    return {
      formValid: true,
      recordsLoading: false,
      noThanks: false
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ['getFairSharingRecords', 'getQueryParams']),
    showAgnosticModal() {
      console.log('wibble');
      let _module = this;
      // User has dismissed the modal already.
      if (_module.noThanks) {
        return false;
      }
      // User hasn't selected any query parameters yet
      console.log(JSON.stringify(_module.getQueryParams));
      console.log("Length: " + Object.keys(_module.getQueryParams).length);
      if (Object.keys(_module.getQueryParams).length === 0) {
        return false
      }
      let counts = [
        _module.getFairSharingRecords.filter(x => x.registry === 'Standard').length == 0,
        _module.getFairSharingRecords.filter(x => x.registry === 'Database').length == 0,
        _module.getFairSharingRecords.filter(x => x.registry === 'Policy').length == 0,
        _module.getFairSharingRecords.filter(x => x.registry === 'Collection').length == 0,
      ]
      console.log(JSON.stringify(counts));
      const callback = (element) => element === true;
      if (counts.some(callback)) {
        console.log('showing modal');
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>
.utilityButtons {
    max-width: 650px
}

</style>

