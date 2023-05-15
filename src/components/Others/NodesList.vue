<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-chip
      v-for="(item, index) in getNodesData"
      :key="index"
      class="ma-2"
      color="orange"
      text-color="white"
      close
      @click:close="deleteItem(item)"
    >
      <v-avatar
        left
        class="orange darken-3"
      >
        {{ formatRecordsNumber(item["recordsNumber"]) }}
      </v-avatar>
      {{ item["records"] }}
    </v-chip>
  </v-container>
</template>

<script>
export default {
  name: 'NodesList',
  props:{
    getNodesData: {
      type: Array,
      required: true
    },
  },
  methods:{
    deleteItem (node) {
      this.$store.commit('nodeListStore/deleteNode', node);
    },
    formatRecordsNumber(num) {
      return  Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    }
  }

};
</script>