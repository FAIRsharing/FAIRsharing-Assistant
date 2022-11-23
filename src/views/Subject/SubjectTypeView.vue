<template>
  <div>
  <p>This is a Subject View</p>
  <FAIRsharing
    :pageName="currentPageName"
    :fairSharingButton="fairSharingButton"
  />

  <SubjectType @enableFairSharingButton="enableFairSharingButton"/>
  </div>
</template>

<script>

import SubjectType from "@/components/SubjectType";
import FAIRsharing from "@/components/Navigation/FAIRsharing";
export default {
  name:'SubjectTypeView',
  components: {
    SubjectType,
    FAIRsharing
  },
  data:() => {
    return {
      fairSharingButton: false
    }
  },
  computed:{
    currentPageName() {
      return this.$children;
    }
  },
  mounted() {
    console.log("currentPageName::", this)
  },

  methods: {
    enableFairSharingButton(value) {
      this.fairSharingButton = value
    }
  }
};
</script>
