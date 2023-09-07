<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
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
        <v-btn
          @click="yesPlease()"
        >
          Yes please
        </v-btn>
        <v-btn
          @click="noThanks()"
        >
          No thanks
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import {mapGetters} from "vuex";


export default {
  name: 'SubjectAgnostic',
  props: {
    searchTagsRef:{
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      recordsLoading: false,
      noThanksSelected: false,
      paramsPresent: false
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ['getFairSharingRecords', 'getQueryParams', 'getCurrentRegistry']),
    showAgnosticModal() {
      let _module = this;
      // User has dismissed the modal already.
      if (_module.noThanksSelected) {
        return false;
      }
      if (_module.getCurrentRegistry) {
        const currentCount = _module.getFairSharingRecords.filter(x => x.registry === _module.getCurrentRegistry).length;
        if (currentCount === 0) {
          return true
        }
        return false;
      }
      else {
        let counts = [
          _module.getFairSharingRecords.filter(x => x.registry === 'Standard').length === 0,
          _module.getFairSharingRecords.filter(x => x.registry === 'Database').length === 0,
          _module.getFairSharingRecords.filter(x => x.registry === 'Policy').length === 0,
          _module.getFairSharingRecords.filter(x => x.registry === 'Collection').length === 0,
        ]
        const callback = (element) => element === true;
        if (counts.some(callback) && Object.keys(_module.getQueryParams).length > 0) {
          return true;
        }
        return false;
      }
    }
  },
  methods: {
    yesPlease() {
      this.searchTagsRef.selectSubjectAgnostic();
      this.noThanksSelected = true;
    },
    noThanks() {
      this.noThanksSelected = true;
    }
  }
}

</script>