<template>
  <div>
    <p>This is a Subject D3 View</p>
    <RefineButton :refine-button="true" />
    <SubjectTypeD3JS />
  </div>
</template>

<script>
import SubjectTypeD3JS from "@/components/Subject/SubjectType_D3JS.vue";
import RefineButton from "@/components/Navigation/RefineButton"

export default {
  name: 'SubjectTypeView',
  components: {
    SubjectTypeD3JS,
    RefineButton
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
