<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div class="d-flex align-center mb-2">
        <AddNodeButton
          v-if="getResource"
        />
      </div>
      <NodesList
        v-if="isNodeList"
        :get-nodes-data="getNodeList"
      />
      <ContinueButton :continue-button="continueButton" />
      <Standards
        @enableFairSharingButton="enableFairSharingButton"
        @showResourceSelected="showResourceSelected"
      />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
      />
      <StartOver />
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import Standards from "@/components/Resource/Standards";
import FairSharingLink from "@/components/Navigation/FairSharingLink";
import StartOver from "@/components/Navigation/StartOver";
import ContinueButton from "@/components/Navigation/ContinueButton"
import Jumbotron from "@/components/Navigation/Jumbotron";
import NodesList from "@/components/Others/NodesList.vue";
import AddNodeButton from "@/components/Navigation/AddNodeButton.vue";

export default {
  name: 'StandardsView',
  components: {
    Standards,
    FairSharingLink,
    StartOver,
    ContinueButton,
    Jumbotron,
    AddNodeButton,
    NodesList
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
    ...mapGetters("nodeListStore", ['getNodeList']),
    isNodeList() {
      const {resourceNodeList, subjectNodeList, domainNodeList} = this.getNodeList
      if ((resourceNodeList.length) || (subjectNodeList.length) || (domainNodeList.length)) return true
      return false
    },
  },
  mounted() {
    let _module = this;
    if (_module.getTopResource || _module.getResource) {
      _module.enableFairSharingButton(true);
    }
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
