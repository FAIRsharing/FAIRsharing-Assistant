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
import { mapState, mapActions, mapGetters } from "vuex"
import * as d3 from 'd3'
import StringMixin from "@/utils/Others/stringMixin.js"
import RecordTypes from "@/utils/Others/recordTypes.js";
import Loaders from "@/components/Loaders/Loaders"
import calculateRecords from "@/utils/Others/calculateRecords";
import { parseLevel, update, toggle, tick } from "@/lib/D3GraphClient";
// import d3data from "@/data/subject.json"
export default {
  name: 'SubjectType',
  components: { Loaders },
  mixins: [StringMixin, RecordTypes, calculateRecords],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showSubjectSelected: false,
      resourceSelected: "" || [],
      domainSelected: "",
      allSubjectsData: {},
      itemClicked: "",
      // d3data: d3data,
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource','getResource','getSubject', 'getDomain']),
    ...mapGetters("addOnFilterSelectedStore", ["getFilters"]),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    ...mapState("browseSubjectsStore", ["subjectBubbleTree", "loadingData"]),
    ...mapState("topSubjectStore", ["topSubjectBubbleTree", "loadingData"]),
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displaySubjects()
      await this.d3Chart()
      this.loading = false
    })
  },
  destroyed() {
    this.leavePage()
    this.resetVariableTags()
    this.resetRecords()
  },
  methods: {
    ...mapActions("browseSubjectsStore", ["fetchTerms", "leavePage"]),
    ...mapActions("topSubjectStore", ["fetchTopSubjectTerms"]),
    ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.showSubjectSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showSubjectSelected', this.showSubjectSelected)
    },

    async displaySubjects() {
      //When user lands on subject type after selecting the TopResource & domainType type
      if(this.getTopResource !== '' && this.getResource === '' && this.getDomain !== ''){
        // eslint-disable-next-line no-console
        console.log("TOP RESOURCE & DOMAIN")
        await this.allOtherRecordTypes(this.resourceSelected)
        this.domainSelected = this.getDomain.toLowerCase()
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, this.domainSelected, "subject", this.getFilters)
      }

      //When user lands on subject type after selecting the resource & domain type
      if (this.getResource !== '' && this.getDomain !== '') {
        // eslint-disable-next-line no-console
        console.log("OTHER RESOURCE & DOMAIN")
        this.resourceSelected = this.formatString(this.getResource)
        this.domainSelected = this.getDomain.toLowerCase()
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, this.domainSelected, "subject", this.getFilters)
      }

      //When user lands on subject type after selecting the TOP Resource type
      if(this.getTopResource !== '' && this.getResource === '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ONLY TOP RESOURCE")
        await this.allOtherRecordTypes(this.resourceSelected)
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, null, "subject", this.getFilters)
      }
      //When user lands on subject type after selecting the resource type
      if(this.getResource !== '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ONLY OTHER RESOURCE")
        this.resourceSelected = this.formatString(this.getResource)
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, null, "subject", this.getFilters)
      }
      //When user lands on subject type after selecting the domain type
      if (this.getTopResource === '' && this.getResource === '' && this.getDomain !== ''){
        // eslint-disable-next-line no-console
        console.log("ONLY DOMAIN")
        this.domainSelected = this.getDomain.toLowerCase()
        this.allSubjectsData = await this.calculateRecords(null, null, this.domainSelected, "subject", this.getFilters)
      }
      //When user lands on subject type as the entry point in the application
      if(this.getTopResource ==="" && this.getResource === '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ALL SUBJECTS")
        await this.fetchTerms()
        this.allSubjectsData = {
          name: "Subject",
          value: 0,
          children: '',
        }
        this.allSubjectsData["children"] = this.subjectBubbleTree
      }
    },

    async d3Chart() {
      const dimensions = {
        "width" : 1200,
        "height": 700,
        "radius": 30
      }

      const force = d3.layout.force()
        .on("tick", (d) => tick(d, dimensions))
        .size([dimensions["width"], dimensions["height"]]);

      const divSelected = this.$refs.chartdiv;
      const svg = d3.select(divSelected).append("svg")
        .attr("width", dimensions["width"])
        .attr("height", dimensions["height"])
        .attr("preserveAspectRatio", "xMaxYMax meet")
        .classed("svg-content", true);

      const root = this.allSubjectsData
      // root = this.d3data
      parseLevel(root, 0);
      // Initialize the display to show level 1
      root.children.forEach(toggle);
      update(root, force, svg, divSelected);

    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .bubbleChart{
    margin: 0 auto;
    text-align: center;
    width:100%;
    max-width: 1024px;
    height: 100%;
    min-height: 650px;
  }
  .node {
    cursor: pointer;
    stroke: #3182bd;
    stroke-width: 8px;
    outline-style: dashed;
    outline-width: 1.5px;
    border-radius: 50%;
  }
  .selectedNode {
    outline-style: solid;
    filter: brightness(1.2);
  }
  .noChlid {
    stroke-width: 0;
    outline-style: none;
    cursor: default
  }
  .link {
    fill: none;
    stroke: #9ecae1;
    stroke-width: 1.5px;
  }

  .tooltip {
    position: absolute;
    text-align: center;
    padding: 5px;
    font-size: 16px;
    color: white;
    border: 1px solid white;
    border-radius: 4px;
    pointer-events: none; /* keep the mouseover when over the tooltip */
    box-shadow: 10px 6px 17px 0px rgba(145,145,145,0.44);
  }
}
</style>
