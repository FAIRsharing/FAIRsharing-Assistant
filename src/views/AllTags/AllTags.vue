<template>
  <div>
    <Jumbotron />
    <div class="px-md-10 pa-5 mb-8">
      <EditTags />
    </div>
  </div>
</template>

<script>

import Jumbotron from "@/components/Navigation/Jumbotron"
import EditTags from "@/components/AllTags/EditTags.vue";

export default {
  name:'AllTags',
  components: {
    Jumbotron,
    EditTags
  },
};
</script>
