<template>
  <div>
    <p>This is a Resource View</p>

    <p class="ma-0" v-if="getSubject['name']">Subject Type Selected: {{getSubject['name']}}</p>
    <p class="ma-0" >Resource Type Selected: {{getResource ? getResource : getTopResource}}</p>

    <FairSharingLink
        :fairSharingButton="fairSharingButton"
    />
    <ResourceType
      @enableFairSharingButton="enableFairSharingButton"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
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
      fairSharingButton: false
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject']),
  },
  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
    }
  }
};
</script>
