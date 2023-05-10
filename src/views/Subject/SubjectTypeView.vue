<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <Selection />
      <RefineButton :refine-button="refineButton" />
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
import RefineButton from "@/components/Navigation/RefineButton"
import Jumbotron from "@/components/Navigation/Jumbotron"
import Selection from "@/components/Others/Selection"
import RecordsTable from "@/components/Others/RecordsTable.vue";

export default {
  name:'SubjectTypeView',
  components: {
    SubjectType,
    FairSharingLink,
    StartOver,
    RefineButton,
    RecordsTable,
    Jumbotron,
    Selection
  },
  data:() => {
    return {
      fairSharingButton: false,
      showSubject: false,
      refineButton: false,
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
      this.refineButton = value
    },
    showSubjectSelected(value){
      this.showSubject = value
    },
  }
};
</script>
