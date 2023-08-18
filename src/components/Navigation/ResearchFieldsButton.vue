<template>
  <div
    class="d-flex align-center"
    :class="{'mb-6 mr-2 full-width utilityButton': $vuetify.breakpoint.smAndDown}"
  >
    <Tooltip :tooltip-text="tooltipText" />
    <v-btn
      v-bind="button['attributes']"
      :block="$vuetify.breakpoint.smAndDown"
      color="primary white--text"
      @click="returnToTags()"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: 'ResearchFieldsButton',
  components: {Tooltip},
  data(){
    return {
      button: {
        text: "Refine tags",
        attributes: {
          elevation:"2",
          raised: true,
          color: "primary",
        }
      },
      tooltipText: "Refine your choice of scientific field"
    }
  },
  methods: {
    returnToTags() {
      this.$router.push('/researchfields');
    },
  }
}

</script>

<style scoped>
.utilityButton {
    max-width: 320px
}
</style>