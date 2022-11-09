<template>
  <div>
    <p v-if="resourceSelected">Resource Type Selected: {{resourceSelected}}</p>
    <div class="charts" id="subjectBubbleChart" ref="circlesdiv">
    </div>
  </div>

</template>

<script>
// import axios from "axios"
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {  browsesubject, policies, standards, database } from '@/data'

export default {
  name: 'SubjectType',
  data:() => {
    return {
      fakedata: browsesubject,
      itemClicked: "",
      policies: policies.data,
      standards: standards.data,
      database: database.data,
      combinedData: [],
      allSubjectData: {}
    }
  },
  props:[
    "resourceSelected",
  ],
  // async beforeCreate() {
  //   try{
  //     await am5.net.load('/naturalScience.json').then(result => {
  //       // console.log(result.response);
  //       this.allSubjectData = result.response
  //       console.log(this.allSubjectData);
  //     })
  //   } catch(result) {
  //     console.log("Error loading:: " + result.xhr.responseURL);
  //   }
  // },
  async created() {
     // await this.fetchData()
    // console.log("fetchingSubjectData::", fetchingSubjectData)
  },
  mounted() {
    this.getCircles()
  },
  updated() {
    this.getCircles()
  },
  methods: {
    async fetchData(url) {
      const response = await fetch(url)
      const data = await response.json()
      return data
    },
    getData() {
      return this.combinedData = [...this.policies, ...this.standards, ...this.database]
    },
    reset(divId) {
      am5.array.each(am5.registry.rootElements, function (root) {
        if (root.dom.id === divId) {
          root.dispose();
        }
      });
    },
    async getCircles() {
      //Reset chart everytime before the chart is created

      this.reset("subjectBubbleChart")
      // Create root element
      let root = am5.Root.new(this.$refs.circlesdiv);

      //To remove amcharts logo
      root._logo.dispose()

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);


      // Set data
      let data

      // Create wrapper container
      let container = root.container.children.push(am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      }));

      // Create series
      let series = container.children.push(am5hierarchy.ForceDirected.new(root, {
        focusable: true,
        ariaLabel: "FAIRassist: Subject Type",
        singleBranchOnly: true,
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
        xField: "x",
        yField: "y",
        // initialFrames: 300,
        // showOnFrame: 1,
        // velocityDecay: 0.3
      }));


      series.get("colors").setAll({
        step: 8
      });
      series.labels.template.setAll({
        fontSize: 20,
      });
      series.outerCircles.template.states.create("disabled", {
        fillOpacity: 0.1,
        strokeOpacity: 1,
        strokeDasharray: 3
      });
      series.links.template.set("strength", 0.5)

      if (this.resourceSelected) {
        let filteredData = this.getData().filter( obj => {
          return obj.name.toLowerCase().replaceAll(' ', '') === this.resourceSelected.toLowerCase().replaceAll(' ', '')
        })
        data = filteredData[0]
      }
      else {
        // Using am5.net load utility the response time is too much to load the hugh amount of subjects data
        // const netLoadResult = await am5.net.load("/subject.json")
        // const netLoadData = await am5.JSONParser.parse(netLoadResult.response)

        this.allSubjectData = await this.fetchData('/subject.json')
        data = this.allSubjectData
        series.setAll({
          "valueField":  "records_count",
          topDepth: -1,
        })

      }

      series.data.setAll([data]);
      series.set("selectedDataItem", series.dataItems[0]);
      // Make stuff animate on load
      series.appear(1000, 100);

      container.children.moveValue(
          am5hierarchy.BreadcrumbBar.new(root, {
            series: series
          }), 0
      );
    }
  }
}
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 700px;
}
</style>
