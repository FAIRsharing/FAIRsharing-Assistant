<template>
  <div
    class="navSecond align-center full-width"
  >
    <v-btn
      v-bind="button['attributes']"
      class="white--text subjectBtn"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "SubjectButton",
  data () {
    return {
      button: {
        text: "Subject",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent",
          to:"/subject",
        }
      },
    }
  },
}
</script>


<style scoped>
.subjectBtn {
  text-transform: initial;
}

</style>
