<template>
  <div :class="[wrapperClass, 'd-flex justify-center']">
    <v-icon
      v-if="!Object.keys($vuetify.icons.values).includes(item)"
      :size="size"
      :color="color"
    >
      {{ $vuetify.icons.values[fallback].icon }}
    </v-icon>
    <v-icon
      v-else-if="$vuetify.icons.values[item].type === 'icon'"
      :size="size"
      :color="color"
    >
      {{ $vuetify.icons.values[item].icon }}
    </v-icon>
    <v-img
      v-else-if="$vuetify.icons.values[item].type === 'img'"
      :class="{'mt-0': wrapperClass !== ''}"
      contain
      :height="height"
      :width="height"
      :src="$vuetify.icons.values[item].icon"
    />
  </div>
</template>

<script>
export default {
  name: "Icon",
  props: {
    item: {default: null, type: String},
    size: {default: '10', type: String},
    fallback: {default: 'undefined', type: String},
    wrapperClass: {default: 'icon-container', type: String},
    height: {default: 45, type: Number},
    color: {default: null, type: String},
  }
}
</script>

<style scoped>
  .icon-container {
    position: absolute;
    top: -25px;
    background: white;
    border: #b3b3b3 dotted 3px;
    border-radius: 50% !important;
    -moz-border-radius: 50% !important;
    -webkit-border-radius: 50% !important;
    width: 45px;
    height: 45px;
    cursor: help;
  }
  .alt-container {
    position: absolute;
    background: white;
    width: 40px;
    height: 40px;
    cursor: help;
  }
</style>