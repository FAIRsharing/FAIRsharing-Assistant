<template>
  <v-container
    fluid
    class="pl-0"
  >
    <v-row
      dense
      no-gutters
      class="text-center"
    >
      <v-col
        cols="12"
        lg="2"
        md="2"
        sm="12"
      >
        <v-card
          flat
          outlined
          tile
        >
          Record type(s)
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="2"
        md="2"
        sm="12"
      >
        <v-card
          flat
          outlined
          tile
        >
          Number of records
        </v-card>
      </v-col>
    </v-row>
    <v-row
      v-for="(item, index) in getAllData"
      :key="index"
      dense
      no-gutters
      class="text-center"
    >
      <v-col
        v-if="item['records']"
        cols="12"
        lg="2"
        md="2"
        sm="12"
      >
        <v-card
          flat
          outlined
          tile
        >
          {{ item["records"] }}
        </v-card>
      </v-col>
      <v-col
        v-if="item['records']"
        cols="12"
        lg="2"
        md="2"
        sm="12"
      >
        <v-card
          flat
          outlined
          tile
        >
          {{ item["recordsNumber"] }}
        </v-card>
      </v-col>
    </v-row>
    <v-row
      dense
      no-gutters
      class="text-center"
    >
      <v-col
        cols="12"
        lg="2"
        md="2"
        sm="12"
      >
        <v-card
          flat
          outlined
          tile
        >
          Total
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="2"
        md="2"
        sm="12"
      >
        <v-card
          flat
          outlined
          tile
        >
          {{ totalRecords }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'RecordsTable',
  props:{
    getAllData: {
      type: Array,
      required: true
    },
  },
  computed:{
    totalRecords() {
      let sum = 0
      this.getAllData.forEach(({recordsNumber}) => {
        if (recordsNumber) sum += recordsNumber
      })

      return sum
    },
  },

};
</script>