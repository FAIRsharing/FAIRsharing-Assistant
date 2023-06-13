<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div class="d-flex align-center mb-2">
        <AddNodeButton
          v-if="getTopResource === 'Standards'"
        />
      </div>
      <NodesList
        v-if="isNodeList"
        :get-nodes-data="getNodeList"
      />
      <RefineButton :refine-button="refineButton" />
      <Standards
        @enableFairSharingButton="enableFairSharingButton"
      />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
      />
      <StartOver />
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
import Standards from "@/components/Resource/Standards";
import FairSharingLink from "@/components/Navigation/FairSharingLink";
import StartOver from "@/components/Navigation/StartOver";
import RefineButton from "@/components/Navigation/RefineButton"
import Jumbotron from "@/components/Navigation/Jumbotron";
import NodesList from "@/components/Others/NodesList.vue";
import AddNodeButton from "@/components/Others/AddNodeButton.vue";

export default {
  name: 'StandardsView',
  components: {
    Standards,
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
      refineButton: false,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource']),
    ...mapGetters("nodeListStore", ['getNodeList']),
    isNodeList() {
      const {resourceNodeList, subjectNodeList, domainNodeList} = this.getNodeList
      if ((resourceNodeList.length) || (subjectNodeList.length) || (domainNodeList.length)) return true
      else return false
    },
    currentRouteName() {
      return this.$route.name;
    },
  },
  beforeMount() {
    const { resourceNodeList } = this.getNodeList
    resourceNodeList.length = 0
  },
  mounted() {
    let _module = this
    if (_module.getTopResource || _module.getResource) {
      _module.enableFairSharingButton(true);
    }

    localStorage.setItem("pageName", this.currentRouteName)
  },
  destroyed() {
    this.fairSharingButton = false
    this.resetNodeSelected()
  },
  methods: {
    ...mapActions("bubbleSelectedStore", ["resetNodeSelected"]),
    enableFairSharingButton(value) {
      if (this.getTopResource === "Standards") {
        this.fairSharingButton = value
        this.refineButton = value
      }
    },
  }
};
</script>
