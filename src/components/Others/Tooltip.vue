<template>
  <div class="tooltip">
    <v-tooltip location="top">
      <template #activator="{ props }">
        <v-icon
          v-bind="props"
          size="x-small"
          class="mr-1"
          :class="whiteText ? 'text-white' : 'text-grey'"
        >
          fa fa-question-circle
        </v-icon>
      </template>
      <span> {{ tooltipText }} </span>
    </v-tooltip>
  </div>
</template>
<script>
export default {
  name: "Tooltip",
  props: {
    tooltipText: {
      type: String,
      default: "",
    },
    whiteText: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
