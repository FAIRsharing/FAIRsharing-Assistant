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

  <div id="domainBubbleChart" class="charts" ref="chartdiv" />

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

// const restClient = new RestClient();

export default {
  name: 'DomainType',
  components: { Loaders },
  mixins: [StringMixin],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      allRecords: [],
      allDomainData: {
        label: "Domain",
        value: 0,
        children: '',
      },
      itemClicked: "",
      recordTypesList: [],
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource', 'getResource', 'getSubject']),
    ...mapState("topDomainsStore", ["domainsType", "loadingData"]),
    ...mapState("recordTypeStore", ["allRecordTypes", "recordTypes", "loadingData"]),
  },

  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displayDomains()
      await this.getCircles()
      this.loading = false
    })
  },
  methods: {
    ...mapActions("recordTypeStore", ["fetchRecordTypes", "fetchAllRecordTypes"]),
    ...mapActions("subjectStore", ["fetchSubjectRecords"]),
    ...mapActions("topDomainsStore", ["fetchTopDomainTerms"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
    },

    // countChildren(domain) {
    //   domain["totalChildren"] = 0;
    //   if (domain["children"] && domain["children"].length) {
    //     for (const child of domain["children"]){
    //       domain["totalChildren"] += this.countChildren(child);
    //     }
    //   }
    //   return domain["totalChildren"];
    // },

   async displayDomains() {
     //Fetching the children from resourceType json data
     await this.fetchAllRecordTypes()
     this.allRecords = this.allRecordTypes["records"].map(({name}) => name)
     await this.fetchTopDomainTerms(this.allRecords)
     this.allDomainData["children"] = this.domainsType
     for (let child of this.allDomainData["children"]) {
       if (child["children"] && child["children"].length) {
         child["totalChildren"] = child["children"].length
       }
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
          valueField: "totalChildren",
          categoryField: "label",//Label displayed
          childDataField: "children",
          idField: "label",
          linkWithField: "linkWith",
          manyBodyStrength: -20,
          centerStrength: 0.8,
          minRadius: 10,
          // maxRadius: 90,
          // minRadius: am5.percent(2.5),
          maxRadius: am5.percent(20),
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
        this.onBubbleSelection()
        const node = e.target.dataItem.dataContext
        if(this.itemClicked !== node["label"]) {
          this.itemClicked = node["label"]
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
