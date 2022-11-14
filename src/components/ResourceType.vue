<template>
<div>
  <p v-if="subjectSelected">Subject Type Selected: {{subjectSelected}}</p>
  <p>Resource Type Selected: {{itemClicked}}</p>
  <div id="resourceBubbleChart" class="charts" ref="chartdiv">
  </div>
</div>

</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex"
import RestClient from "@/lib/Client/RESTClient.js"
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import StringMixin from "@/utils/stringMixin.js"
import { canvasGetImageData } from "@/utils/canvasRenderingContext"
import { breadCrumbBar } from "@/utils/breadCrumbBar"
import { resourcetype } from '@/data'

const restClient = new RestClient();

export default {
  name: 'ResourceType',
  mixins: [StringMixin],
  data:() => {
    return {
      allRecords: [],
      allResourceData: resourcetype,
      itemClicked: "",
      recordTypesList: []
    }
  },
  props:[
    "subjectSelected",
  ],
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getSubject']),
    ...mapState("recordTypeStore", ["recordTypes", "loadingData"]),
  },

  async mounted() {
    await this.getResourceData()
    await this.displayResources()

    this.$nextTick(async () =>{
      if (this.getSubject !== undefined) {
        console.log("Subject Selected::", this.getSubject)
      }
      this.getCircles()
    })

  },
  methods: {
    ...mapActions("recordTypeStore", ["fetchRecordTypes"]),

    async getResourceData() {
      this.allRecords = await restClient.getRecordsData()
    },

   async displayResources() {
    //Fetching the resource/records id children record from the graphQl query
    const resourceIds = this.allRecords.map(({ id }) => id)
     //  for (const id of resourceIds) {
    //
    //    await this.fetchRecordTypes(id)
    //    //Pushing all children list into the array
    //    this.recordTypesList.push(this.recordTypes)
    //  }

    // Using Promise.all the records are fetched in parallel which optimises the performance
     await Promise.all(resourceIds.map(async (id) => {
       await this.fetchRecordTypes(id)
       this.recordTypesList.push(this.recordTypes)
     }));

     //Fetching the children from resourceType json data
     const otherResources = this.allResourceData["children"].map(({children}) => children)
     const otherResourceType = otherResources.flatMap(child => child)

     //Assigning total number of fairsharingRecords to resourceTypes
     otherResourceType.filter(item => {
       const commonItem = this.recordTypesList.find(ele => this.formatString(item.name) === ele.name)
         if(this.formatString(item.name) === commonItem.name) {
          item.value = commonItem["fairsharingRecords"].length
         }
     })
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
      let data = this.allResourceData;
      // Create wrapper container
      let container = root.container.children.push(am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      }));
      // Create series
      let series = container.children.push(am5hierarchy.ForceDirected.new(root, {
          ariaLabel: "FAIRassist: Resource Type",
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
          // maxRadius: 90,
          // minRadius: am5.percent(6),
          maxRadius: am5.percent(10),
      }));

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
        const basicResourceTypes = ['Database', 'Standards', 'Policies'];
        const nodeName = e.target.dataItem.dataContext.name
        if( this.itemClicked !== nodeName && !basicResourceTypes.includes(nodeName)) {
          this.itemClicked = nodeName
          this.$store.commit("bubbleSelectedStore/resourceSelected", this.itemClicked)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 600px;
}
</style>
