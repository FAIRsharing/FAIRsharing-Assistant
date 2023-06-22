<template>
  <div
    class="ma-0"
  >
    <v-btn
      v-bind="button['attributes']"
      class="white--text refineBtn"
      :disabled="!refineButton"
    >
      {{ button["text"] }}
    </v-btn>
    <v-tooltip
      v-if="!refineButton"
      color="indigo"
      right
    >
      <template #activator="{ on, attrs }">
        <v-icon
          color="primary"
          dark
          small
          v-bind="attrs"
          class="ml-2"
          v-on="on"
        >
          fa fa-question-circle
        </v-icon>
      </template>
      <span v-if="isObjEmpty">Click on the bubble and add record to the list to enable</span>
      <span v-else>Add record to the list to enable</span>
    </v-tooltip>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "RefineButton",
  props:{
    refineButton: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      button: {
        text: "Refine my choice",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent",
          to: {path: "/refine-my-choice", replace: true},
        }
      },
    }
  },

  computed:{
    ...mapGetters("bubbleSelectedStore", ['getNodes']),
    isObjEmpty () {
      return Object.keys(this.getNodes).length === 0;
    }
  }

}
</script>


<style scoped>
.refineBtn {
  text-transform: initial;
}

</style>
