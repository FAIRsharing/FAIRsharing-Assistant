<template>
  <div>
    <p>This is a Policies View</p>
    <p
      v-if="showResource"
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
      v-if="getDomain"
      class="ma-0 text-capitalize"
    >
      Domain Type Selected: {{ getDomain }}
    </p>

    <FairSharingLink
      :fair-sharing-button="fairSharingButton"
    />
    <Policies
      @enableFairSharingButton="enableFairSharingButton"
      @showResourceSelected="showResourceSelected"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import FairSharingLink from "@/components/Navigation/FairSharingLink";
import Policies from "@/components/Policies";
export default {
  name: 'PoliciesView',
  components: {
    Policies,
    FairSharingLink
  },
  data:() => {
    return {
      fairSharingButton: false,
      showResource: false,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain']),
  },
  destroyed() {
    this.showResource = false
  },
  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
    },
    showResourceSelected(value){
      this.showResource = value
    }
  }
};
</script>
