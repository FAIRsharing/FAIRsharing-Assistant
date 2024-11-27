<template>
  <div
    class="d-flex align-center"
    :class="{'mb-6 mr-2 full-width utilityButton': $vuetify.display.smAndDown}"
  >
    <Tooltip :tooltip-text="tooltipText" />
    <v-btn
      v-bind="button['attributes']"
      data-testid="clearResults"
      :block="$vuetify.display.smAndDown"
      :disabled="!clearButtonActive"
      color="dev_color white--text"
      @click="clearResults()"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/Others/Tooltip.vue";

export default {
  name: 'ClearAllSelections',
  components: {Tooltip},
  props: {
    refinePage: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      button: {
        text: "Clear all selections",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent2",
        }
      },
      tooltipText: "This will clear all filters and tags"
    }
  },
  computed: {
    ...mapGetters('multiTagsStore', ["getFairSharingRecords", "getQueryParams", "getRefinedStatus", "getCurrentRegistry"]),

    clearButtonActive() {
      let _module = this;
      if (_module.getFairSharingRecords && _module.getFairSharingRecords.length > 0) {
        return true;
      }
      else if (_module.getQueryParams && Object.keys(_module.getQueryParams).length > 0) {
        return true;
      }
      else if (_module.getRefinedStatus) {
        return true;
      }
      else if (_module.getCurrentRegistry) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions('multiTagsStore', ['resetMultiTags']),

    clearResults() {
      this.resetMultiTags()
      if(this.refinePage) this.$router.push('/researchfields')
    }
  }
}

</script>

<style scoped>
.utilityButton {
    max-width: 320px
}
</style>