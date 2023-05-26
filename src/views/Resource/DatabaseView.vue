<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div class="d-flex align-center mb-2">
        <AddNodeButton
          v-if="getTopResource === 'Database'"
        />
      </div>
      <NodesList
        v-if="isNodeList"
        :get-nodes-data="getNodeList"
      />
      <RefineButton :refine-button="refineButton" />
      <Database
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
import Database from "@/components/Resource/Database";
import FairSharingLink from "@/components/Navigation/FairSharingLink"
import StartOver from "@/components/Navigation/StartOver";
import RefineButton from "@/components/Navigation/RefineButton"
import Jumbotron from "@/components/Navigation/Jumbotron"
import AddNodeButton from "@/components/Others/AddNodeButton.vue";
import NodesList from "@/components/Others/NodesList.vue";

export default {
  name: 'DatabaseView',
  components: {
    Database,
    FairSharingLink,
    StartOver,
    RefineButton,
    Jumbotron,
    NodesList,
    AddNodeButton
  },
  data:() => {
    return {
      fairSharingButton: false,
      showResource: false,
      refineButton: false,
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
    this.fairSharingButton = false
  },
  methods: {
    enableFairSharingButton(value) {
      if (this.getTopResource === "Database") {
        this.fairSharingButton = value
        this.refineButton = value
      }
    },
    showResourceSelected(value){
      this.showResource = value
    }
  }
};
</script>
