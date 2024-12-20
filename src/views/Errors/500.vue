<template>
  <v-row style="height: 50vh" class="d-flex align-center">
    <v-col
      cols="12"
      lg="4"
      md="12"
      sm="12"
      class="mx-auto d-flex justify-center"
    >
      <v-img src="/assets/Errors/500.png" width="500px" class="contain" />
    </v-col>
  </v-row>
</template>

<script>
// import { useHead } from "@unhead/vue";
//
// useHead({
//   title: "FAIRassist | Server Error",
// });
export default {
  name: "Error500",
};
</script>

<style scoped></style>
