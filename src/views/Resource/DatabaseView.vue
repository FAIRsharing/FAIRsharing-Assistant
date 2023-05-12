<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div class="d-flex align-center mb-2">
        <Selection />
        <AddNodeButton
          v-if="getResource"
        />
      </div>
      <NodesTable
        v-if="getNodeList && getNodeList.length"
        :get-nodes-data="getNodeList"
      />
      <ContinueButton :continue-button="continueButton" />
      <Database
        @enableFairSharingButton="enableFairSharingButton"
        @showResourceSelected="showResourceSelected"
      />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
      />
      <RecordsTable
        v-if="getResource"
        :get-all-data="getAllResources"
      />
      <StartOver />
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import Database from "@/components/Resource/Database";
import FairSharingLink from "@/components/Navigation/FairSharingLink"
import StartOver from "@/components/Navigation/StartOver";
import ContinueButton from "@/components/Navigation/ContinueButton"
import RecordsTable from "@/components/Others/RecordsTable"
import Jumbotron from "@/components/Navigation/Jumbotron"
import Selection from "@/components/Others/Selection"
import AddNodeButton from "@/components/Navigation/AddNodeButton.vue";
import NodesTable from "@/components/Others/NodesTable.vue";
export default {
  name: 'DatabaseView',
  components: {
    Database,
    FairSharingLink,
    StartOver,
    ContinueButton,
    RecordsTable,
    Jumbotron,
    Selection,
    NodesTable,
    AddNodeButton,
  },
  data:() => {
    return {
      fairSharingButton: false,
      showResource: false,
      continueButton: false,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource']),
    ...mapGetters("nodeListStore", ['getNodeList'])
  },
  destroyed() {
    this.showResource = false
  },
  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
      this.continueButton = value
    },
    showResourceSelected(value){
      this.showResource = value
    }
  }
};
</script>
