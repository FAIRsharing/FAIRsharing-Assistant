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
import StringMixin from "@/utils/stringMixin.js"
import Loaders from "@/components/Loaders"

export default {
  name: 'ResourceType',
  components: { Loaders },
  mixins: [StringMixin],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showResourceSelected: false,
      allRecords: [],
      allResourceData: {
        name: "Resource",
        value: 0,
        children: [],
      },
      itemClicked: "",
      recordTypesList: [],
      subjectSelected: "",
      domainSelected: ""
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getResource', 'getSubject', 'getDomain']),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    ...mapState("multiTagsStore", ["fairSharingRecords", "loadingStatus"]),
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
    this.resetMultiTags()
    this.resetVariableTags()
  },
  methods: {
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),
    ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),
    ...mapActions("multiTagsStore", ["fetchMultiTagsTerms", "resetMultiTags"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.showResourceSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showResourceSelected', this.showResourceSelected)
    },

    /**
     * Calculate the number of fairSharing records for each record type and assign the total
     * @param {String} resourceSelected - The resource selected
     * @param {String} subjectSelected - The subject selected
     * @param {String} domainSelected - The domain selected
     * @param {Array} otherResourceType - All the recordTypes
     * @returns {Number} - Number of  each recordsTpe
     */
    async calculateRecords(resourceSelected, subjectSelected, domainSelected, otherResourceType) {
      //Using multiTagFilter Query
      await this.fetchMultiTagsTerms([resourceSelected, subjectSelected, domainSelected])
      for (let childResource of otherResourceType) {
        childResource["value"] = 0
        this.fairSharingRecords.filter(ele => {
          if (ele["type"] === this.formatString(childResource["name"])) {
            childResource["value"]++
          }
        })
      }
    },
    /**
     * Creates initial skeleton/structure for resource page as array of objects
     * Level -1 : 3 Registries (Database, Standards, Policy)
     * Level -2 : 14 Record types (e.g knowledgebase, repository, metric etc. )
     * @returns {Array} - Array of objects
     */
    async createResourceStructure() {
      await this.fetchAllRecordTypes()
      let topResources = [...new Set(this.allRecordTypes["records"].map(({fairsharingRegistry}) => fairsharingRegistry["name"]))]

      //Removing "Collection" topResource/registry
      topResources = topResources.filter(item => item !== "Collection")
      //Converting array of topResource/registry to object
      const topResourceTypeObj = topResources.map((name) => ({name}))
      //Creating Array of object for topResource/registry with chidlren (array of objects)
      topResourceTypeObj.forEach((ele) => {
        ele["children"] = []
        this.allRecordTypes["records"].filter(({name, fairsharingRegistry}) => {
          if(fairsharingRegistry["name"] === ele["name"]) {
            ele["children"].push({
              name: this.normalString(name),
              value: 0
            })
          }
        })
        if (ele["name"] === "Standard") ele["name"] = "Standards"
        else if (ele["name"] === "Policy") ele["name"] = "Policies"
        this.allResourceData["children"].push(ele)
      })
      return this.allResourceData
    },

    async displayResources() {
      await this.createResourceStructure()
      const otherResources = this.allResourceData["children"].map(({children}) => children)
      const otherResourceType = otherResources.flatMap(child => child)

      //When User lands on Resource page after selecting the Subject & Domain
      if(this.getSubject !=="" && this.getDomain !== ""){
        console.log("SUBJECT & DOMAIN")
        this.subjectSelected = this.getSubject.toLowerCase()
        this.domainSelected = this.getDomain.toLowerCase()
        await this.calculateRecords(null, this.subjectSelected, this.domainSelected, otherResourceType)
      }

      //When User lands on Resource page after selecting the Domain
      if(this.getSubject ==="" && this.getDomain !== ""){
        console.log("ONLY DOMAIN")
        this.domainSelected = this.getDomain.toLowerCase()
        await this.calculateRecords(null,null, this.domainSelected, otherResourceType)
      }

      //When User lands on Resource page after selecting the Subject
      if (this.getSubject !=="" && this.getDomain === "") {
        console.log("ONLY SUBJECT")
        this.subjectSelected = this.getSubject.toLowerCase()
        await this.calculateRecords(null, this.subjectSelected,null, otherResourceType)
      }
      //When User lands on Resource page as an entry point
      if(this.getResource === "" && this.getSubject ==="" && this.getDomain === "") {
        console.log("ALL RESOURCES")
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
              childResourceSelected: this.itemClicked
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
