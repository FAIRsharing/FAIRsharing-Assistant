<template>
  <div>
    <p>This is a D3 View</p>
    <DomainType_D3JS />
  </div>
</template>

<script>
import DomainType_D3JS from "@/components/Domain/DomainType_D3JS.vue";

export default {
  name: 'DomainTypeView',
  components: {
    DomainType_D3JS
  },
  data:() => {
    return {
      fairSharingButton: false,
      showDomain: false
    }
  },

  mounted() {
  },
  methods: {

  }
};
</script>
