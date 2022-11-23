<template>
  <div>
    <p>This is a Resource View</p>
    <ResourceType />
  </div>
</template>

<script>

import ResourceType from "@/components/ResourceType";
export default {
  name: 'ResourceTypeView',
  components: {
    ResourceType
  },
  mounted() {
    console.log("currentPageName::", this)
  },
};
</script>
