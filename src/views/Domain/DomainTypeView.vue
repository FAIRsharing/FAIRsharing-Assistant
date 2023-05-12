<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div class="d-flex align-center mb-2">
        <Selection />
        <AddNodeButton
          v-if="getDomain"
        />
      </div>
      <NodesTable
        v-if="getNodeList && getNodeList.length"
        :get-nodes-data="getNodeList"
      />
      <ContinueButton :continue-button="continueButton" />
      <DomainType
        @enableFairSharingButton="enableFairSharingButton"
        @showDomainSelected="showDomainSelected"
      />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
      />
      <RecordsTable
        v-if="getDomain"
        :get-all-data="getDomainList"
      />
      <StartOver />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import DomainType from "@/components/Domain/DomainType";
import FairSharingLink from "@/components/Navigation/FairSharingLink";
import StartOver from "@/components/Navigation/StartOver"
import ContinueButton from "@/components/Navigation/ContinueButton"
import Jumbotron from "@/components/Navigation/Jumbotron"
import Selection from "@/components/Others/Selection"
import RecordsTable from "@/components/Others/RecordsTable.vue";
import NodesTable from "@/components/Others/NodesTable.vue";
import AddNodeButton from "@/components/Navigation/AddNodeButton.vue";

export default {
  name: 'DomainTypeView',
  components: {
    DomainType,
    FairSharingLink,
    StartOver,
    ContinueButton,
    RecordsTable,
    Jumbotron,
    Selection,
    AddNodeButton,
    NodesTable,
  },
  data:() => {
    return {
      fairSharingButton: false,
      showDomain: false,
      continueButton: false,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getDomain', 'getDomainList']),
    ...mapGetters("nodeListStore", ['getNodeList'])
  },
  destroyed() {
    this.showDomain = false
  },
  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
      this.continueButton = value
    },
    showDomainSelected(value) {
      this.showDomain = value
    }
  }
};
</script>
