<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div class="d-flex align-center mb-2">
        <AddNodeButton
          v-if="getTopResource === 'Policies'"
        />
      </div>
      <NodesList
        v-if="isNodeList"
        :get-nodes-data="getNodeList"
      />
      <RefineButton :refine-button="refineButton" />
      <Policies
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
import Policies from "@/components/Resource/Policies"
import FairSharingLink from "@/components/Navigation/FairSharingLink"
import StartOver from "@/components/Navigation/StartOver"
import RefineButton from "@/components/Navigation/RefineButton"
import Jumbotron from "@/components/Navigation/Jumbotron"
import AddNodeButton from "@/components/Others/AddNodeButton.vue";
import NodesList from "@/components/Others/NodesList.vue";
export default {
  name: 'PoliciesView',
  components: {
    Policies,
    FairSharingLink,
    StartOver,
    RefineButton,
    Jumbotron,
    AddNodeButton,
    NodesList
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
      if (this.getTopResource === "Policies") {
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
