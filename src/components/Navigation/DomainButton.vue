<template>
  <div
    class="navSecond d-flex justify-space-around align-center full-width mx-3"
  >
    <v-btn
      v-bind="button['attributes']"
      class="white--text domainBtn"
    >
      {{ button["text"] }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "DomainButton",
  data () {
    return {
      button: {
        text: "Refine by Domain",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent3",
          to:"/domain",
        }
      },
    }
  },
}
</script>


<style scoped>
.domainBtn {
  text-transform: initial;
}

</style>
