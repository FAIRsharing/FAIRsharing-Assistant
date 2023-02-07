<template>
  <div>
    <p>This is a Domain View</p>
    <p
      v-if="(getTopResource || getResource)"
      class="ma-0 text-capitalize"
    >
      Resource Type Selected: {{ getResource ? getResource : getTopResource }}
    </p>
    <p
      v-if="getSubject"
      class="ma-0 text-capitalize"
    >
      Subject Type Selected: {{ getSubject }}
    </p>
    <p
      v-if="showDomain"
      class="ma-0 text-capitalize"
    >
      Domain Type Selected: {{ getDomain }}
    </p>

    <FairSharingLink
      :fair-sharing-button="fairSharingButton"
    />
    <DomainType
      @enableFairSharingButton="enableFairSharingButton"
      @showDomainSelected="showDomainSelected"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import DomainType from "@/components/Domain/DomainType";
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
