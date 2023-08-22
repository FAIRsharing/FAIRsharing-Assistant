<template>
  <div>
    <Jumbotron />
    <RefineSelection />
  </div>
</template>

<script>

import Jumbotron from "@/components/Navigation/Jumbotron";
import RefineSelection from "@/components/RefineSelection/RefineSelection.vue"

export default {
  name: 'RefineRegistry',
  components: {
    Jumbotron,
    RefineSelection
  },
};
</script>
