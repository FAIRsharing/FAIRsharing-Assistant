<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <Selection />
      <RefineButton :refine-button="refineButton" />
      <Policies
        @enableFairSharingButton="enableButton"
        @showResourceSelected="showResourceSelected"
      />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
      />
      <RecordsTable
        v-if="getResource"
        :get-all-resources="getAllResources"
      />
      <StartOver />
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import Policies from "@/components/Resource/Policies"
import FairSharingLink from "@/components/Navigation/FairSharingLink"
import StartOver from "@/components/Navigation/StartOver"
import RefineButton from "@/components/Navigation/RefineButton"
import RecordsTable from "@/components/Others/RecordsTable"
import Jumbotron from "@/components/Navigation/Jumbotron"
import Selection from "@/components/Others/Selection"
export default {
  name: 'PoliciesView',
  components: {
    Policies,
    FairSharingLink,
    StartOver,
    RefineButton,
    RecordsTable,
    Jumbotron,
    Selection
  },
  data:() => {
    return {
      fairSharingButton: false,
      showResource: false,
      refineButton: false,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource', 'getSubject', 'getDomain']),
  },
  destroyed() {
    this.showResource = false
  },
  methods: {
    enableButton(value) {
      this.fairSharingButton = value
      this.refineButton = value
    },
    showResourceSelected(value){
      this.showResource = value
    }
  }
};
</script>
