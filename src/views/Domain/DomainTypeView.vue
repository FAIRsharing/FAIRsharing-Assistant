<template>
  <div>
    <p>This is a Domain View</p>
    <p class="ma-0 text-capitalize" v-if="(getTopResource || getResource)">Resource Type Selected: {{getResource ? getResource : getTopResource}}</p>
    <p class="ma-0 text-capitalize" v-if="getSubject['name']">Subject Type Selected: {{getSubject['name']}}</p>
    <p class="ma-0 text-capitalize" >Domain Type Selected: {{ getDomain }}</p>

    <FairSharingLink
        :fairSharingButton="fairSharingButton"
    />
    <DomainType
        @enableFairSharingButton="enableFairSharingButton"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import DomainType from "@/components/DomainType";
import FairSharingLink from "@/components/Navigation/FairSharingLink";

export default {
  name: 'DomainTypeView',
  components: {
    DomainType,
    FairSharingLink
  },
  data:() => {
    return {
      fairSharingButton: false
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain']),
  },
  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
    }
  }
};
</script>
