<template>
  <div>
    <v-fade-transition v-if="loading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <div
      ref="chartdiv"
      class="bubbleChart"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex"
import calculateResourceRecords from "@/utils/ResourceUtils/calculateResourceRecords"
import createResourceStructure from "@/utils/ResourceUtils/createResourceStructure";
import StringMixin from "@/utils/Others/stringMixin.js"
import Loaders from "@/components/Loaders/Loaders"
import { svgGraph, forceGraph, parseLevel, update, toggle } from "@/lib/D3GraphClient";
import totalResourceRecords from "@/utils/ResourceUtils/totalResourceRecords";

export default {
  name: 'Standards',
  components: { Loaders },
  mixins: [StringMixin, calculateResourceRecords, createResourceStructure],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showResourceSelected: false,
      allRecords: [],
      allResourceData: {},
      itemClicked: "",
      recordTypesList: [],
      subjectSelected: "",
      domainSelected: "",
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource','getResource','getSubject', 'getDomain']),
    ...mapGetters("otherResourcesSelectedStore", ["getOtherResourceSelected"]),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
  },
  watch:{
    getTopResource(){
      this.onBubbleSelection()
    }
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displayResources()
      await this.d3Chart()
      this.loading = false
    })
  },
  destroyed() {
    this.resetRecords()
  },
  methods: {
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.showResourceSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showResourceSelected', this.showResourceSelected)
    },

    async displayResources() {
      this.allResourceData = await this.createResourceStructure("Standard")
      const otherResources = this.allResourceData["children"].map(({children}) => children)
      const otherResourceType = otherResources.flatMap(child => child)

      //When User lands on Resource page after selecting the Subject & Domain
      if (this.getSubject !== "" && this.getDomain !== "") {
        // eslint-disable-next-line no-console
        console.log("SUBJECT & DOMAIN")
        this.subjectSelected = this.getSubject.toLowerCase()
        this.domainSelected = this.getDomain.toLowerCase()
        await this.calculateRecords(null, this.subjectSelected, this.domainSelected, otherResourceType)
      }

      //When User lands on Resource page after selecting the Domain
      if (this.getSubject === "" && this.getDomain !== "") {
        // eslint-disable-next-line no-console
        console.log("ONLY DOMAIN")
        this.domainSelected = this.getDomain.toLowerCase()
        await this.calculateRecords(null, null, this.domainSelected, otherResourceType)
      }

      //When User lands on Resource page after selecting the Subject
      if (this.getSubject !== "" && this.getDomain === "") {
        // eslint-disable-next-line no-console
        console.log("ONLY SUBJECT")
        this.subjectSelected = this.getSubject.toLowerCase()
        await this.calculateRecords(null, this.subjectSelected, null, otherResourceType)
      }
      //When User lands on Standard page as an entry point
      if (this.getResource === "" && this.getSubject === "" && this.getDomain === "") {
        // eslint-disable-next-line no-console
        console.log("ALL Standards")
        //Fetching all resources/records
        await this.fetchAllRecordTypes()
        this.allRecords = this.allRecordTypes["records"].map(({name}) => name)
        await this.calculateRecords(this.allRecords, null, null, otherResourceType)
        const totalRecords = totalResourceRecords(this.getOtherResourceSelected)
        this.allResourceData["children"][0].records_count
            = totalRecords
      }
    },

    /**
     * Plotting the hierarchy bubble chart using d3Js library
     */
    async d3Chart() {
      const routeName = this.$route.name
      const force = forceGraph()
      const divSelected = this.$refs.chartdiv;
      const svg = svgGraph(divSelected)
      const root = this.allResourceData
      parseLevel(root, 0);

      // Initialize the display to show level 1
      root.children.forEach(toggle);
      update(root, force, svg, divSelected, routeName);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/lib/D3GraphClient/Styles/d3graph.scss";
</style>
