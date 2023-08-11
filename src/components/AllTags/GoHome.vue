<template>
  <div
    class="d-flex align-center"
    :class="{'mb-6 mr-2 full-width utilityButton': $vuetify.breakpoint.smAndDown}"
  >
    <Tooltip :tooltip-text="tooltipText" />
    <v-btn
      :block="$vuetify.breakpoint.smAndDown"
      color="dev_color white--text"
      @click="goHome()"
    >
      Home
    </v-btn>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: 'GoHome',
  components: {Tooltip},
  data(){
    return {
      tooltipText: "Return to the home page, clearing all tags and filters."
    }
  },
  methods: {
    ...mapActions('multiTagsStore', ['resetMultiTags']),
    goHome() {
      this.resetMultiTags()
      const allSelectedTags = {
        domains: [],
        taxonomies: [],
        subjects: [],
        user_defined_tags: []
      }

      const allRecordTags = []
      this.$emit('startOver', [allSelectedTags, allRecordTags])
      this.$router.push('/')
    }
  }
}

</script>

<style scoped>
.utilityButton {
    max-width: 320px
}
</style>