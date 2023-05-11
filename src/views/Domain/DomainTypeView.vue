<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <Selection />
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

export default {
  name: 'DomainTypeView',
  components: {
    DomainType,
    FairSharingLink,
    StartOver,
    ContinueButton,
    RecordsTable,
    Jumbotron,
    Selection
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
