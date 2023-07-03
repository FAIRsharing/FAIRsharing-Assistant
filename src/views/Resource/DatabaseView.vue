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
        :get-filters-data="getFilterLists"
      />
      <div class="d-flex justify-space-around mt-6">
        <FairSharingLink
          :fair-sharing-button="fairSharingButton"
        />
        <RefineButton :refine-button="refineButton" />
        <StartOver
          :class="{'mt-4':$vuetify.breakpoint.smAndDown}"
        />
      </div>
      <Database
        @enableFairSharingButton="enableFairSharingButton"
      />
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
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
      refineButton: false,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getTopResource', 'getResource']),
    ...mapGetters("nodeListStore", ['getNodeList', 'getFilterLists']),
    isNodeList() {
      const {resourceNodeList, subjectNodeList, domainNodeList} = this.getNodeList
      if ((resourceNodeList.length) || (subjectNodeList.length) || (domainNodeList.length)) return true
      return false
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
    let _module = this;
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
      if (this.getTopResource === "Database") {
        this.fairSharingButton = value
        this.refineButton = value
      }
    },
  }
};
</script>
