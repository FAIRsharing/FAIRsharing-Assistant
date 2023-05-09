<template>
  <div
    class="navSecond d-flex justify-space-around align-center full-width mb-4"
  >
    <v-btn
      v-bind="button['attributes']"
      class="white--text applyFilterBtn"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ApplyFilterButton",
  data () {
    return {
      button: {
        text: "Apply Filter",
        attributes: {
          elevation:"2",
          raised: true,
          color: "ready_color",
        }
      },
    }
  },
}
</script>


<style scoped>
.applyFilterBtn {
  text-transform: initial;
}

</style>
