<template>
  <v-row style="height: 50vh" class="d-flex align-center">
    <v-col
      cols="12"
      lg="4"
      md="12"
      sm="12"
      class="mx-auto d-flex justify-center"
    >
      <v-img src="/assets/Errors/404.png" width="500px" class="contain" />
    </v-col>
  </v-row>
</template>

<script>
import { useHead } from "@unhead/vue";

useHead({
  title: "FAIRassist | Not Found",
});
export default {
  name: "Error404",
};
</script>
