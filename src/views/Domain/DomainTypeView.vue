<template>
  <div>
    <p>This is a Domain View</p>
    <p class="ma-0 text-capitalize" v-if="(getTopResource || getResource)">Resource Type Selected: {{getResource ? getResource : getTopResource}}</p>
    <p class="ma-0 text-capitalize" v-if="getSubject['name']">Subject Type Selected: {{getSubject['name']}}</p>
    <p class="ma-0 text-capitalize" v-if="showDomain">Domain Type Selected: {{ getDomain }}</p>

    <FairSharingLink
        :fairSharingButton="fairSharingButton"
    />
    <DomainType
        @enableFairSharingButton="enableFairSharingButton"
        @showDomainSelected = "showDomainSelected"
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
      fairSharingButton: false,
      showDomain: false
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain']),
  },
  destroyed() {
    this.showDomain = false
  },
  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
    },
    showDomainSelected(value) {
      this.showDomain = value
    }
  }
};
</script>
