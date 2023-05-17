<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div
        class="d-flex full-width mb-8"
        style="max-width: 300px; margin: 0 auto"
      >
        <SubjectButton />
        <DomainButton />
      </div>
      <NodesList
        v-if="isNodeList"
        :get-nodes-data="getNodeList"
      />
      <AddOnFilters />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
      />
      <StartOver />
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import FairSharingLink from "@/components/Navigation/FairSharingLink";
import StartOver from "@/components/Navigation/StartOver";
import Jumbotron from "@/components/Navigation/Jumbotron";
import SubjectButton from "@/components/Navigation/SubjectButton";
import DomainButton from "@/components/Navigation/DomainButton";
import AddOnFilters from "@/components/Others/AddOnFilters.vue";
import NodesList from "@/components/Others/NodesList.vue";

export default {
  name: 'RefineView',
  components: {
    FairSharingLink,
    Jumbotron,
    StartOver,
    SubjectButton,
    DomainButton,
    AddOnFilters,
    NodesList
  },
  data:() => {
    return {
      fairSharingButton: true,
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
};
</script>

