<template>
  <div
    class="navSecond mx-3"
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
        text: "Refine by Subject",
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
