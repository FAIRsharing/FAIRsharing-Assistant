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
      id="resourceBubbleChart"
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
import calculateResourceRecords from "@/utils/ResourceUtils/calculateResourceRecords"
import createResourceStructure from "@/utils/ResourceUtils/createResourceStructure";
import StringMixin from "@/utils/stringMixin.js"
import Loaders from "@/components/Loaders/Loaders"

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
      domainSelected: ""
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getResource', 'getSubject', 'getDomain']),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    // ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    // ...mapState("multiTagsStore", ["fairSharingRecords", "loadingStatus"]),
  },

  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displayResources()
      await this.getCircles()
      this.loading = false
    })
  },
  destroyed() {
    this.resetRecords()
    // this.resetMultiTags()
    // this.resetVariableTags()
  },
  methods: {
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),
    // ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),
    // ...mapActions("multiTagsStore", ["fetchMultiTagsTerms", "resetMultiTags"]),

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
      if(this.getSubject !=="" && this.getDomain !== ""){
        // eslint-disable-next-line no-console
        console.log("SUBJECT & DOMAIN")
        this.subjectSelected = this.getSubject.toLowerCase()
        this.domainSelected = this.getDomain.toLowerCase()
        await this.calculateRecords(null, this.subjectSelected, this.domainSelected, otherResourceType)
      }

      //When User lands on Resource page after selecting the Domain
      if(this.getSubject ==="" && this.getDomain !== ""){
        // eslint-disable-next-line no-console
        console.log("ONLY DOMAIN")
        this.domainSelected = this.getDomain.toLowerCase()
        await this.calculateRecords(null,null, this.domainSelected, otherResourceType)
      }

      //When User lands on Resource page after selecting the Subject
      if (this.getSubject !=="" && this.getDomain === "") {
        // eslint-disable-next-line no-console
        console.log("ONLY SUBJECT")
        this.subjectSelected = this.getSubject.toLowerCase()
        await this.calculateRecords(null, this.subjectSelected,null, otherResourceType)
      }
      //When User lands on Resource page as an entry point
      if(this.getResource === "" && this.getSubject ==="" && this.getDomain === "") {
        // eslint-disable-next-line no-console
        console.log("ALL Standards")
        //Fetching all resources/records
        await this.fetchAllRecordTypes()
        this.allRecords = this.allRecordTypes["records"].map(({name}) => name)
        await this.calculateRecords(this.allRecords,null,null, otherResourceType)
      }
    },

    /**
     * Plotting the hierarchy bubble chart using AmCharts5 library
     */
    getCircles() {
      let data = this.allResourceData; // Set data
      let root = am5.Root.new(this.$refs.chartdiv); // Create root element
      const canvas = this.$el.querySelector("canvas")
      canvasGetImageData(canvas)
      root._logo.dispose() //To remove amcharts logo
      root.setThemes([am5themes_Animated.new(root)]); // Set themes
      // Create wrapper container
      let container = root.container.children.push(am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      }));
      // Create series
      let series = container.children.push(am5hierarchy.ForceDirected.new(root, {
        ariaLabel: "Resource Type",
        singleBranchOnly: false,
        downDepth: 1,
        upDepth: 1,
        topDepth: 1,
        initialDepth: 0,
        valueField: "value",
        categoryField: "name",//Label displayed
        childDataField: "children",
        idField: "name",
        linkWithField: "linkWith",
        manyBodyStrength: -20,
        centerStrength: 0.8,
        minRadius: 60,
        maxRadius: am5.percent(10),
      }));

      series.get("colors").setAll({
        step: 2
      });
      series.labels.template.set("fontSize", 20)
      series.outerCircles.template.states.create("disabled", {
        fillOpacity: 0.1,
        strokeOpacity: 1,
        strokeDasharray: 3
      });

      // When a bubble is clicked
      series.nodes.template.events.on("click", (e) => {
        this.onBubbleSelection()
        const nodeParent = e.target.dataItem._settings.parent.dataContext.name
        const node = e.target.dataItem.dataContext

        if(this.itemClicked !== node["name"]) {
          if (node["children"] && node["children"].length) {
            this.itemClicked = node["name"]
            this.$store.commit("bubbleSelectedStore/resourceSelected", {
              topResourceSelected: this.itemClicked,
              childResourceSelected: ''
            })
          }
          else {
            this.itemClicked = node["name"]
            this.$store.commit("bubbleSelectedStore/resourceSelected", {
              topResourceSelected: nodeParent,
              childResourceSelected: this.itemClicked,
              recordsNumber: node["value"]
            })
          }
        }
      });

      series.links.template.set("strength", 0.5);
      series.data.setAll([data]);
      series.set("selectedDataItem", series.dataItems[0]);
      series.appear(1000, 100); // Make stuff animate on load

      // Add Breadcrumbs
      setTimeout(() => {
        breadCrumbBar(container, root, series)
      }, 300);
    }}
}
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 600px;
}
</style>
