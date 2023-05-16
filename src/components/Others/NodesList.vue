<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-row
      v-if="getNodesData['resourceNodeList'] && getNodesData['resourceNodeList'].length"
      dense
      no-gutters
      class="text-left"
    >
      <v-col
        cols="3"
        lg="3"
        md="3"
        sm="3"
      >
        <TotalRecords
          :get-nodes-data="getNodesData['resourceNodeList']"
          type="Resources"
        />
      </v-col>
      <v-col
        cols="9"
        lg="9"
        md="9"
        sm="9"
      >
        <v-chip
          v-for="(item, index) in getNodesData['resourceNodeList']"
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
      </v-col>
    </v-row>
    <v-row
      v-if="getNodesData['subjectNodeList'] && getNodesData['subjectNodeList'].length"
      dense
      no-gutters
      class="text-left"
    >
      <v-col
        cols="3"
        lg="3"
        md="3"
        sm="3"
      >
        <TotalRecords
          :get-nodes-data="getNodesData['subjectNodeList']"
          type="Subjects"
        />
      </v-col>
      <v-col
        cols="9"
        lg="9"
        md="9"
        sm="9"
      >
        <v-chip
          v-for="(item, index) in getNodesData['subjectNodeList']"
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
      </v-col>
    </v-row>
    <v-row
      v-if="getNodesData['domainNodeList'] && getNodesData['domainNodeList'].length"
      dense
      no-gutters
      class="text-left"
    >
      <v-col
        cols="3"
        lg="3"
        md="3"
        sm="3"
      >
        <TotalRecords
          :get-nodes-data="getNodesData['domainNodeList']"
          type="Domains"
        />
      </v-col>
      <v-col
        cols="9"
        lg="9"
        md="9"
        sm="9"
      >
        <v-chip
          v-for="(item, index) in getNodesData['domainNodeList']"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TotalRecords from "@/components/Others/TotalRecords.vue";

export default {
  name: 'NodesList',
  components: {TotalRecords},
  props:{
    getNodesData: {
      type: Object,
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