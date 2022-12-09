<template>
  <div>
  <p>This is a Subject View</p>
    <p class="ma-0 text-capitalize" v-if="(getTopResource || getResource)">Resource Type Selected: {{getResource ? getResource : getTopResource}}</p>
    <p class="ma-0 text-capitalize" v-if="showSubject">Subject Type Selected: {{ getSubject["name"] }}</p>
    <p class="ma-0 text-capitalize" v-if="getDomain">Domain Type Selected: {{getDomain}}</p>
    <FairSharingLink
    :fairSharingButton="fairSharingButton"
  />
    <SubjectType
    @enableFairSharingButton="enableFairSharingButton"
    @showSubjectSelected="showSubjectSelected"
  />
  </div>
</template>

<script>
import { mapGetters} from "vuex";
import SubjectType from "@/components/SubjectType";
import FairSharingLink from "@/components/Navigation/FairSharingLink";

export default {
  name:'SubjectTypeView',
  components: {
    SubjectType,
    FairSharingLink
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
