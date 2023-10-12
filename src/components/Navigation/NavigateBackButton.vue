<template>
  <div
    v-if="getPreviousLocation"
    class="d-flex align-center"
    :class="{'mb-6 mr-2 full-width utilityButton': $vuetify.breakpoint.smAndDown}"
  >
    <Tooltip :tooltip-text="tooltipText" />
    <v-btn
      v-bind="button['attributes']"
      :block="$vuetify.breakpoint.smAndDown"
      color="dev_color white--text"
      @click="navigateToPrevious($router.history.current.path)"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: 'NavigateBack',
  components: {Tooltip},
  data(){
    return {
      button: {
        text: "Previous Page",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent2",
        }
      },
      tooltipText: "Return to the last page you were viewing"
    }
  },
  methods: {
    ...mapGetters('navigationStore', ['getPreviousLocation']),
    navigateToPrevious(current) {
      let previous = this.getPreviousLocation();
      this.$store.commit('navigationStore/setNavigationState', current);
      this.$router.push({path: previous});
    }
  }
}

</script>

<style scoped>
.utilityButton {
  max-width: 320px
}
</style>