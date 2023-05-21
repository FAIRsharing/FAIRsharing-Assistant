<template>
  <v-container
    fluid
    class="pa-0"
  >
    <!-- Resource Node List -->
    <v-row
      v-if="getNodesData['resourceNodeList'] && getNodesData['resourceNodeList'].length"
      dense
      no-gutters
      class="text-left"
    >
      <v-col
        cols="2"
        lg="2"
        md="2"
        sm="2"
      >
        <TotalRecords
          :get-nodes-data="getNodesData['resourceNodeList']"
          type="Resources"
        />
      </v-col>
      <v-col
        cols="10"
        lg="10"
        md="10"
        sm="10"
      >
        <v-chip
          v-for="(item, index) in getNodesData['resourceNodeList']"
          :key="index"
          class="ma-2"
          color="orange"
          text-color="white"
          :close="isRefineView"
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
    <!-- Subject Node List -->
    <v-row
      v-if="getNodesData['subjectNodeList'] && getNodesData['subjectNodeList'].length"
      dense
      no-gutters
      class="text-left"
    >
      <v-col
        cols="2"
        lg="2"
        md="2"
        sm="2"
      >
        <TotalRecords
          :get-nodes-data="getNodesData['subjectNodeList']"
          type="Subjects"
        />
      </v-col>
      <v-col
        cols="10"
        lg="10"
        md="10"
        sm="10"
      >
        <v-chip
          v-for="(item, index) in getNodesData['subjectNodeList']"
          :key="index"
          class="ma-2"
          color="orange"
          text-color="white"
          :close="isRefineView"
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
    <!-- Domain Node List -->
    <v-row
      v-if="getNodesData['domainNodeList'] && getNodesData['domainNodeList'].length"
      dense
      no-gutters
      class="text-left"
    >
      <v-col
        cols="2"
        lg="2"
        md="2"
        sm="2"
      >
        <TotalRecords
          :get-nodes-data="getNodesData['domainNodeList']"
          type="Domains"
        />
      </v-col>
      <v-col
        cols="10"
        lg="10"
        md="10"
        sm="10"
      >
        <v-chip
          v-for="(item, index) in getNodesData['domainNodeList']"
          :key="index"
          class="ma-2"
          color="orange"
          text-color="white"
          :close="isRefineView"
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
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    isRefineView() {
      return this.currentRouteName !== "RefineView" ? true : false
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