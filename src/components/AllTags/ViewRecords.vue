<template>
  <div
    class="d-flex align-center"
    :class="{'mb-6 mr-2 full-width utilityButton': $vuetify.breakpoint.smAndDown}"
  >
    <Tooltip :tooltip-text="tooltipText" />
    <v-btn
      :block="$vuetify.breakpoint.smAndDown"
      :disabled="!resultsButtonActive"
      color="internal white--text"
      @click="showResults()"
    >
      View records
    </v-btn>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue"

export default {
  name: 'ViewRecords',
  components:{Tooltip},
  data(){
    return {
      tooltipText: "See the list of FAIRsharing records matching your selections below."
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords"]),
    resultsButtonActive() {
      if (this.getFairSharingRecords && this.getFairSharingRecords.length) return true;
      else return false;
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

<style scoped>
.utilityButton {
    max-width: 320px
}
</style>