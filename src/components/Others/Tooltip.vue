<template>
  <div>
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          small
          class="grey--text mr-1"
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
    }
  }
}

</script>