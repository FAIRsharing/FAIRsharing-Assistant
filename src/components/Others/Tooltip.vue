<template>
  <div class="tooltip">
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          x-small
          class=" mr-1"
          :class="whiteText ? 'white--text': 'grey--text'"
          v-on="on"
        >
          fa-question-circle
        </v-icon>
      </template>
      <span> {{ tooltipText }} </span>
    </v-tooltip>
  </div>
</template>

<script>

export default {
  name: 'Tooltip',
  props:{
    tooltipText:{
      type:String,
      default: ""
    },
    whiteText: {
      type: Boolean,
      default: false
    }
  }
}

</script>

<style scoped>
.tooltip {
    margin-top: -1px
}
</style>
