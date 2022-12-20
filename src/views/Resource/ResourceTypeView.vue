<template>
  <div>
    <p>This is a Resource View</p>
    <p
      v-if="showResource"
      class="ma-0 text-capitalize"
    >
      Resource Type Selected: {{ getResource ? getResource : getTopResource }}
    </p>
    <p
      v-if="getSubject['name']"
      class="ma-0 text-capitalize"
    >
      Subject Type Selected: {{ getSubject['name'] }}
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
    <ResourceType
      @enableFairSharingButton="enableFairSharingButton"
      @showResourceSelected="showResourceSelected"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import ResourceType from "@/components/ResourceType";
import FairSharingLink from "@/components/Navigation/FairSharingLink";
export default {
  name: 'ResourceTypeView',
  components: {
    ResourceType,
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
