<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div
        class="d-flex full-width mb-8"
        :class="{'flex-column':$vuetify.breakpoint.smAndDown}"
        style="max-width: 300px; margin: 0 auto"
      >
        <SubjectButton
          :class="{'mb-4':$vuetify.breakpoint.smAndDown}"
        />
        <DomainButton />
      </div>
      <NodesList
        v-if="isNodeList"
        :get-nodes-data="getNodeList"
      />
      <AddOnFilters @filterSource="onCardsSelection" />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
        :prev-route="prevRoute"
      />
      <StartOver
        :class="{'mt-4':$vuetify.breakpoint.smAndDown}"
      />
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
      prevRoute: "",
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getAllResources', 'getSubjectList', 'getDomainList']),
    ...mapGetters("nodeListStore", ['getNodeList']),
    isNodeList() {
      const {resourceNodeList, subjectNodeList, domainNodeList} = this.getNodeList
      if ((resourceNodeList.length) || (subjectNodeList.length) || (domainNodeList.length)) return true
      else return false
    },
  },
  mounted() {
    this.prevRoute = localStorage.getItem("pageName");

    //When user is Refine-my-choice page directly, without any pre-selection
    if((!this.getAllResources.length) && (!this.getSubjectList.length) && (!this.getDomainList.length) && (this.$route.fullPath === "/refine-my-choice")) {
      this.$router.push("/")
    }

  },
  methods: {
    onCardsSelection(value) {
      this.prevRoute = value
    }
  }
};
</script>

