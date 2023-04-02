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
  name: "DomainButtonD3",
  data () {
    return {
      button: {
        text: "Refine by Domain D3",
        attributes: {
          elevation:"2",
          raised: true,
          color: "accent3",
          to:"/domaind3js",
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
