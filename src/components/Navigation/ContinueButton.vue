<template>
  <div
    class="navSecond d-flex justify-space-around align-center full-width"
  >
    <v-btn
      v-bind="button['attributes']"
      class="white--text refineBtn"
      :disabled="!continueButton"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ContinueButton",
  props:{
    continueButton: Boolean,
  },
  data () {
    return {
      button: {
        text: "Continue",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent",
          to: {path: "/refine-my-choice", replace: true},
        }
      },
    }
  },

}
</script>


<style scoped>
.refineBtn {
  text-transform: initial;
}

</style>
