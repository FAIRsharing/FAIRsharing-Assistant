<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <div class="d-flex align-center">
        <Selection /> <AddNodeButton />
      </div>
      <ContinueButton :continue-button="continueButton" />
      <SubjectType
        @enableFairSharingButton="enableFairSharingButton"
        @showSubjectSelected="showSubjectSelected"
      />
      <FairSharingLink
        :fair-sharing-button="fairSharingButton"
      />
      <RecordsTable
        v-if="getSubject"
        :get-all-data="getSubjectList"
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
import RecordsTable from "@/components/Others/RecordsTable.vue";
import AddNodeButton from "@/components/Navigation/AddNodeButton.vue";

export default {
  name:'SubjectTypeView',
  components: {
    SubjectType,
    FairSharingLink,
    StartOver,
    ContinueButton,
    RecordsTable,
    Jumbotron,
    Selection,
    AddNodeButton
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
