<template>
  <div
    class="d-flex align-center"
    :class="{'mb-6 mr-2 full-width utilityButton': $vuetify.breakpoint.smAndDown}"
  >
    <Tooltip :tooltip-text="tooltipText" />
    <v-btn
      v-bind="button['attributes']"
      :block="$vuetify.breakpoint.smAndDown"
      color="dev_color white--text"
      @click="goHome()"
    >
      {{ button["text"] }}
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
      button: {
        text: "Home",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent2",
        }
      },
      tooltipText: "Return to the home page, clearing all filters and tags"
    }
  },
  methods: {
    ...mapActions('multiTagsStore', ['resetMultiTags']),
    goHome() {
      this.resetMultiTags();
      this.$router.push('/0')
    }
  }
}

</script>

<style scoped>
.utilityButton {
    max-width: 320px
}
</style>