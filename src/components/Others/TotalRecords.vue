<template>
  <div
    class="navSecond align-center ml-4"
  >
    <v-chip
      v-bind="chip['attributes']"
      class="ma-2"
    >
      {{ chip["text"] }} : {{ totalRecordsNumber }}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "TotalRecords",
  props:{
    getNodesData: {
      type: Array,
      required: true
    },
  },
  data () {
    return {
      chip: {
        text: "Total Records",
        attributes: {
          label: true,
          textColor:"white",
          color: "purple",
        }
      },
    }
  },
  computed:{
    totalRecordsNumber() {
      let sum = 0
      this.getNodesData.forEach(({recordsNumber}) => {
        if (recordsNumber) sum += recordsNumber
      })

      return sum;
    },
  },
}
</script>

