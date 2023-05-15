<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div class="d-flex align-center mb-2">
        <Selection />
        <AddNodeButton
          v-if="getSubject"
        />
        <TotalRecords
          v-if="getNodeList && getNodeList.length"
          :get-nodes-data="getNodeList"
        />
      </div>
      <NodesList
        v-if="getNodeList && getNodeList.length"
        :get-nodes-data="getNodeList"
      />
      <ContinueButton :continue-button="continueButton" />
      <SubjectType
        @enableFairSharingButton="enableFairSharingButton"
        @showSubjectSelected="showSubjectSelected"
      />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
      />
      <StartOver />
    </div>
  </div>
</template>

<script>
import { mapGetters} from "vuex";
import SubjectType from "@/components/Subject/SubjectType";
import FairSharingLink from "@/components/Navigation/FairSharingLink";
import StartOver from "@/components/Navigation/StartOver"
import ContinueButton from "@/components/Navigation/ContinueButton"
import Jumbotron from "@/components/Navigation/Jumbotron"
import Selection from "@/components/Others/Selection"
import AddNodeButton from "@/components/Navigation/AddNodeButton.vue";
import NodesList from "@/components/Others/NodesList.vue";
import TotalRecords from "@/components/Others/TotalRecords.vue";

export default {
  name:'SubjectTypeView',
  components: {
    SubjectType,
    FairSharingLink,
    StartOver,
    ContinueButton,
    Jumbotron,
    Selection,
    AddNodeButton,
    NodesList,
    TotalRecords
  },
  data:() => {
    return {
      fairSharingButton: false,
      showSubject: false,
      continueButton: false,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getSubject', 'getSubjectList']),
    ...mapGetters("nodeListStore", ['getNodeList'])
  },
  mounted() {
    let _module = this;
    if (_module.getSubject) {
      _module.enableFairSharingButton(true);
    }
  },
  destroyed() {
    this.showSubject = false
  },
  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
      this.continueButton = value
    },
    showSubjectSelected(value){
      this.showSubject = value
    },
  }
};
</script>
