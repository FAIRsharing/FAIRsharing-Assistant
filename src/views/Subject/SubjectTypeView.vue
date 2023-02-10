<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <Selection />
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
import Jumbotron from "@/components/Navigation/Jumbotron"
import Selection from "@/components/Others/Selection"

export default {
  name:'SubjectTypeView',
  components: {
    SubjectType,
    FairSharingLink,
    StartOver,
    Jumbotron,
    Selection
  },
  data:() => {
    return {
      fairSharingButton: false,
      showSubject: false
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain']),
  },
  destroyed() {
    this.showSubject = false
  },
  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
    },
    showSubjectSelected(value){
      this.showSubject = value
    },
  }
};
</script>
