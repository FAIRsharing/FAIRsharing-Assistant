<template>
  <div>
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
      <span> See the list of FAIRsharing records matching your selections below. </span>
    </v-tooltip>
    <v-btn
      :disabled="!resultsButtonActive"
      color="internal white--text"
      class="mr-10"
      @click="showResults()"
    >
      View records
    </v-btn>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'ViewRecords',
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords"]),
    resultsButtonActive() {
      if (!this.getFairSharingRecords) {
        return false;
      }
      return this.getFairSharingRecords.length > 0;
    }
  },
  methods: {
    showResults() {
      let _module = this;
      _module.$router.push('/results')
    },
  }
}

</script>