<template>
  <v-container
    fluid
    class="pl-0"
  >
    <v-chip
      v-for="(item, index) in getNodesData"
      :key="index"
      class="ma-2"
      color="orange"
      text-color="white"
    >
      <v-avatar
        left
        class="orange darken-3"
      >
        {{ item["recordsNumber"] }}
      </v-avatar>
      {{ item["name"] }}
    </v-chip>
  </v-container>
</template>

<script>
export default {
  name: 'RecordsTable',
  props:{
    getNodesData: {
      type: Array,
      required: true
    },
  },
  // computed:{
  //   totalRecords() {
  //     let sum = 0
  //     this.getNodesData.forEach(({recordsNumber}) => {
  //       if (recordsNumber) sum += recordsNumber
  //     })
  //
  //     return sum
  //   },
  // },

};
</script>