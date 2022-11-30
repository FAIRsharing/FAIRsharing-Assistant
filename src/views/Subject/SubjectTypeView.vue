<template>
  <div>
  <p>This is a Subject View</p>
    <p class="ma-0 text-capitalize" v-if="getResource">Resource Type Selected: {{getResource}}</p>
    <p class="ma-0 text-capitalize">Subject Type Selected: {{ getSubject["name"] }}</p>
    <p class="ma-0 text-capitalize" v-if="getDomain">Domain Type Selected: {{getDomain}}</p>
    <FairSharingLink
    :fairSharingButton="fairSharingButton"
  />
    <SubjectType
    @enableFairSharingButton="enableFairSharingButton"
  />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
      fairSharingButton: false
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getResource', 'getSubject', 'getDomain']),
  },
  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
    }
  }
};
</script>
