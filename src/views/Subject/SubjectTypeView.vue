<template>
  <div>
    <p>This is a Subject View</p>
    <p
      v-if="(getTopResource || getResource)"
      class="ma-0 text-capitalize"
    >
      Resource Type Selected: {{ getResource ? getResource : getTopResource }}
    </p>
    <p
      v-if="showSubject"
      class="ma-0 text-capitalize"
    >
      Subject Type Selected: {{ getSubject["name"] }}
    </p>
    <p
      v-if="getDomain"
      class="ma-0 text-capitalize"
    >
      Domain Type Selected: {{ getDomain }}
    </p>
    <FairSharingLink
      :fair-sharing-button="fairSharingButton"
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
