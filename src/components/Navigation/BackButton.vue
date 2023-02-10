<template>
  <div
    class="navSecond align-center full-width"
  >
    <v-btn
      v-bind="button['attributes']"
      class="white--text backBtn"
      @click="goBack"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "BackButton",
  props:{
    previousPage: String,
  },
  data () {
    return {
      button: {
        text: "Back",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent",
        }
      },
    }
  },
  methods:{
    goBack() {
      return this.$router.go(-1)
    }
  },
}
</script>


<style scoped>
.backBtn {
  text-transform: initial;
}

</style>
