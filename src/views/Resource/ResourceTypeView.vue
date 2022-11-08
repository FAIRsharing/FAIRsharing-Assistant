<template>
  <div>
    <p>This is a Resource View</p>
  <ResourceType @resourceTypeSelected="resourceBubbleSelected"/>
  </div>
</template>

<script>

import ResourceType from "@/components/ResourceType";
export default {
  name: 'ResourceTypeView',
  components: {
    ResourceType
  },
  data() {
    return {
      resourceTypeSelected: ""
    }
  },
  methods: {
    resourceBubbleSelected(item) {
      this.$emit('resourceTypeSelected', item);
      console.log("item::", item)
    },
  }
};
</script>
