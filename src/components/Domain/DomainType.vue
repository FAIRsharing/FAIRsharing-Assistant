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
import StringMixin from "@/utils/Others/stringMixin.js"
import RecordTypes from "@/utils/Others/recordTypes.js";
import Loaders from "@/components/Loaders/Loaders"
import calculateRecords from "@/utils/Others/calculateRecords";
import { svgGraph, forceGraph, parseLevel, update, toggle } from "@/lib/D3GraphClient";

export default {
  name: 'DomainType',
  components: { Loaders },
  mixins: [StringMixin, RecordTypes, calculateRecords],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showDomainSelected: false,
      resourceSelected: "" || [],
      subjectSelected: "",
      allDomainData: {},
      itemClicked: "",
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain']),
    ...mapGetters("addOnFilterSelectedStore", ["getFilters"]),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
  },
  watch:{
    getDomain(){
      this.onBubbleSelection()
    }
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displayDomains()
      await this.d3Chart()
      this.loading = false
    })
  },
  destroyed() {
    this.resetRecords()
    this.resetVariableTags()
  },
  methods: {
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),
    ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.showDomainSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showDomainSelected', this.showDomainSelected)
    },


    async displayDomains() {
      //When user lands on domain type after selecting the TopResource & SubjectType type
      if(this.getTopResource !== '' && this.getResource === '' && this.getSubject !== ""){
        // eslint-disable-next-line no-console
        console.log("TOP RESOURCE & SUBJECT")
        await this.allOtherRecordTypes(this.resourceSelected)
        this.subjectSelected = this.getSubject.toLowerCase()
        this.allDomainData = await this.calculateRecords(this.resourceSelected, this.subjectSelected, null, "domain", this.getFilters)
      }
      //When user lands on domain type after selecting the OtherResource & SubjectType type
      if(this.getTopResource !== '' && this.getResource !== '' && this.getSubject !==""){
        // eslint-disable-next-line no-console
        console.log("OTHER RESOURCE & SUBJECT")
        this.resourceSelected = this.formatString(this.getResource)
        this.subjectSelected = this.getSubject.toLowerCase()
        this.allDomainData = await this.calculateRecords(this.resourceSelected, this.subjectSelected, null, "domain", this.getFilters)
      }
      //When user lands on domain type after selecting the TOPResource type
      if(this.getTopResource !== '' && this.getResource === '' && this.getSubject === ""){
        // eslint-disable-next-line no-console
        console.log("ONLY TOP RESOURCE")
        // await this.recordTypes()
        await this.allOtherRecordTypes(this.resourceSelected)
        this.allDomainData = await this.calculateRecords(this.resourceSelected, null, null, "domain", this.getFilters)
      }
      //When user lands on domain type after selecting the OtherResource type
      if(this.getTopResource !== '' && this.getResource !== '' && this.getSubject === ""){
        // eslint-disable-next-line no-console
        console.log("ONLY OTHER RESOURCE")
        this.resourceSelected = this.formatString(this.getResource)
        this.allDomainData = await this.calculateRecords(this.resourceSelected, null, null, "domain", this.getFilters)
      }
      //When user lands on domain type after selecting SubjectType type
      if(this.getTopResource === '' && this.getResource === '' && this.getSubject !==""){
        // eslint-disable-next-line no-console
        console.log("ONLY SUBJECT")
        this.subjectSelected = this.getSubject.toLowerCase()
        this.allDomainData = await this.calculateRecords(null, this.subjectSelected, null, "domain", this.getFilters)
      }
    },
    async d3Chart() {
      const routeName = this.$route.name
      const force = forceGraph()
      const divSelected = this.$refs.chartdiv;
      const svg = svgGraph(divSelected)
      const root = this.allDomainData
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