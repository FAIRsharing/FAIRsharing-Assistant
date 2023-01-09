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
      id="domainBubbleChart"
      ref="chartdiv"
      class="charts"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex"
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { canvasGetImageData } from "@/utils/canvasRenderingContext"
import { breadCrumbBar } from "@/utils/breadCrumbBar"
import StringMixin from "@/utils/stringMixin.js"
import Loaders from "@/components/Loaders"

export default {
  name: 'DomainType',
  components: { Loaders },
  mixins: [StringMixin],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showDomainSelected: false,
      resourceSelected: "" || [],
      subjectSelected: "",
      allDomainData: {
        name: "Domain",
        value: 0,
        children: "",
      },
      itemClicked: "",
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject', 'getDomain']),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
  },

  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displayDomains()
      await this.getCircles()
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

    topResource() {
      switch(this.getTopResource) {
      case "Standards":
        return "Standard"
      case "Policies":
        return "Policy"
      default:
        return this.getTopResource
      }
    },

    async recordTypes() {
      await this.fetchAllRecordTypes()
      this.allRecordTypes["records"].filter(({name, fairsharingRegistry}) =>{
        if (this.topResource() === fairsharingRegistry["name"]) {
          this.resourceSelected.push(name)
        }
      })
    },

    async calculateRecords(resourceSelected, subjectSelected, domainSelected, groupBy) {
      //Using variableFilter query
      await this.fetchVariableTags([resourceSelected, subjectSelected, domainSelected, groupBy])
      this.allDomainData["children"] = this.variableResponse
    },

    async displayDomains() {
      //When user lands on domain type after selecting the TopResource & SubjectType type
      if(this.getTopResource !== '' && this.getResource === '' && this.getSubject !== ""){
        console.log("TOP RESOURCE & SUBJECT")
        await this.recordTypes()
        this.subjectSelected = this.getSubject.toLowerCase()
        await this.calculateRecords(this.resourceSelected, this.subjectSelected, null, "domain")
      }
      //When user lands on domain type after selecting the OtherResource & SubjectType type
      if(this.getTopResource !== '' && this.getResource !== '' && this.getSubject !==""){
        console.log("OTHER RESOURCE & SUBJECT")
        this.resourceSelected = this.formatString(this.getResource)
        this.subjectSelected = this.getSubject.toLowerCase()
        await this.calculateRecords(this.resourceSelected, this.subjectSelected, null, "domain")
      }
      //When user lands on domain type after selecting the TOPResource type
      if(this.getTopResource !== '' && this.getResource === '' && this.getSubject === ""){
        console.log("ONLY TOP RESOURCE")
        await this.recordTypes()
        await this.calculateRecords(this.resourceSelected, null, null, "domain")
      }
      //When user lands on domain type after selecting the OtherResource type
      if(this.getTopResource !== '' && this.getResource !== '' && this.getSubject === ""){
        console.log("ONLY OTHER RESOURCE")
        this.resourceSelected = this.formatString(this.getResource)
        await this.calculateRecords(this.resourceSelected, null, null, "domain")
      }
      //When user lands on domain type after selecting SubjectType type
      if(this.getTopResource === '' && this.getResource === '' && this.getSubject !==""){
        console.log("ONLY SUBJECT")
        this.subjectSelected = this.getSubject.toLowerCase()
        await this.calculateRecords(null, this.subjectSelected, null, "domain")
      }
    },

    getCircles() {
      // Create root element
      let root = am5.Root.new(this.$refs.chartdiv);

      const canvas = this.$el.querySelector("canvas")
      canvasGetImageData(canvas)

      //To remove amcharts logo
      root._logo.dispose()

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);

      // Set data
      let data = this.allDomainData;
      // Create wrapper container
      let container = root.container.children.push(am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      }));
      // Create series
      let series = container.children.push(am5hierarchy.ForceDirected.new(root, {
        ariaLabel: "FAIRassist: Domain Type",
        singleBranchOnly: false,
        downDepth: 1,
        upDepth: 1,
        topDepth: 1,
        initialDepth: 0,
        valueField: "records_count",
        categoryField: "name",//Label displayed
        childDataField: "children",
        idField: "label",
        linkWithField: "linkWith",
        manyBodyStrength: -20,
        centerStrength: 0.8,
        minRadius: 20,
        maxRadius: am5.percent(20),
      }));

      if (!this.allDomainData["children"].length){
        series.set("topDepth", 0);
      }

      series.get("colors").setAll({
        step: 2
      });

      series.labels.template.setAll({
        fontSize: 20,
      });
      series.outerCircles.template.states.create("disabled", {
        fillOpacity: 0.1,
        strokeOpacity: 1,
        strokeDasharray: 3
      });

      // When a bubble is clicked
      series.nodes.template.events.on("click", (e) => {
        this.onBubbleSelection()
        const node = e.target.dataItem.dataContext
        let nodeName
        if (node["label"]) {
          nodeName = node["label"]
        }
        else {
          nodeName = node["name"]
        }
        if(this.itemClicked["name"] !== nodeName) {
          this.itemClicked = nodeName
          console.log("itemClicked::", this.itemClicked)
          this.$store.commit("bubbleSelectedStore/domainSelected", this.itemClicked)
        }
      });

      console.log("data::", data)
      series.links.template.set("strength", 0.5);
      series.data.setAll([data]);
      series.set("selectedDataItem", series.dataItems[0]);
      series.appear(1000, 100); // Make stuff animate on load

      // Add Breadcrumbs
      setTimeout(() => {
        breadCrumbBar(container, root, series)
      }, 300);
    }
  }
}
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 800px;
}
</style>
