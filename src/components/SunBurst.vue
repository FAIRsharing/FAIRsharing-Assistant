<template>
<div>
  <p>Resource Type Clicked: {{resourceSelected}}</p>
  <div class="charts" id="subjectBubbleChart" ref="circlesdiv">
  </div>
  <div class="charts" id="sunBurstChart" ref="sunburstsdiv">
  </div>
</div>

</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { sunburstdata, policies, standards, database } from '@/data'


export default {
  name: 'SunBurst',
  data:() => {
    return {
      itemClicked: "",
      fakedata: sunburstdata,
      policies: policies.data,
      standards: standards.data,
      database: database.data,
      combinedData: [],
      subjects: [],
      subjectSelected: [],
    }
},
  props:[
      "resourceSelected",
  ],

  mounted() {
    console.log("resourceSelected Mounted::", this.resourceSelected)
    this.getCircles()

  },
  updated() {
    console.log("resourceSelected Updated::", this.resourceSelected)
    this.reset("sunBurstChart")
    this.getCircles()
  },
  //Try for async data when using fetch/axios
  // watch:{
  //   resourceSelected(newVal, oldVal) {
  //     console.log("newVal::", newVal)
  //     console.log("oldVal::", newVal)
  //     if (newVal !== oldVal) {
  //       console.log("Updated resourceSelected::", this.resourceSelected)
  //       this.reset("sunBurstChart")
  //       this.getCircles()
  //     }
  //   }
  // },
  methods: {
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
    getCircles() {

      this.reset("subjectBubbleChart")

      // Create root element
      let root = am5.Root.new(this.$refs.circlesdiv);

      //To remove amcharts logo
      root._logo.dispose()

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);


      // Set data
      let filteredData = this.getData().filter( obj => {
        return obj.name.toLowerCase().replaceAll(' ', '') === this.resourceSelected.toLowerCase().replaceAll(' ', '')
      })

      let data = filteredData[0]
      this.subjects = data.children

      // let data = this.fakedata;


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
        singleBranchOnly: false,
        downDepth: 0,
        upDepth: 0,
        topDepth: 1,
        initialDepth: 0,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
        idField: "name",
        linkWithField: "linkWith",
        manyBodyStrength: -20,
        centerStrength: 0.8,
        minRadius: 80,
        // maxRadius: 90,
        // minRadius: am5.percent(6),
        maxRadius: am5.percent(7)
      }));
      series.get("colors").setAll({
        step: 8
      });

      series.labels.template.setAll({
        fontSize: 30,
      });

      //When a  subject bubble is cliked
      series.nodes.template.events.on("click", (e) => {
        console.log("e.target:::", e.target);
        console.log("e.target.dataItem._settings.id:::", e.target.dataItem._settings.id);
        console.log("this.itemClicked:::", this.itemClicked);
        if( this.itemClicked !== e.target.dataItem._settings.id) {
          this.itemClicked = e.target.dataItem._settings.id
          this.subjectSelected = this.subjects.filter((subject) => {
            return subject.name.toLowerCase().replaceAll(' ', '') === this.itemClicked.toLowerCase().replaceAll(' ', '')
          })
          // console.log("BubbleCliked")
          this.getSunBurst()
        }
      });

      series.links.template.set("strength", 0.5);
      series.data.setAll([data]);
      series.set("selectedDataItem", series.dataItems[0]);
      series.outerCircles.template.states.create("disabled", {
        fillOpacity: 0.5,
        strokeOpacity: 0,
        strokeDasharray: 0
      });


      // console.log("series", series.dataItems[0]);
      // Make stuff animate on load
      series.appear(1000, 100);
    },
    getSunBurst() {
      //Reset sunburst chart
      this.reset("sunBurstChart")

      // Create root element
      let root = am5.Root.new(this.$refs.sunburstsdiv)

      //To remove amcharts logo
      root._logo.dispose()

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);

      // Set data
      // let data = this.fakedata;

      // Create wrapper container
      let container = root.container.children.push(am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layout: root.verticalLayout
      }));

      // Create series
      let series = container.children.push(am5hierarchy.Sunburst.new(root, {
        focusable: true,
        isMeasured: true,
        ariaLabel: "FAIRassist: Subject Slice",
        singleBranchOnly: true,
        downDepth: 10,
        initialDepth: 10,
        valueField: "value",
        categoryField: "name",
        childDataField: "children"
      }));

      //When the outermost slice is clicked, it will be redirected to url from response
      //which will be FAIRsharing page in this case
      series.slices.template.events.on("click", (e) => {
        const data = e.target.dataItem.dataContext
        if(!data.children && data.url && data.url.length) {
          const url = data.url
          window.open(url)
        }
      });

      container.children.moveValue(
          am5hierarchy.BreadcrumbBar.new(root, {
            series: series
          }), 0
      );


      // Generate and set data
        // https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data
      let maxLevels = 2;
      let maxNodes = 3;
      let maxValue = 100;

      let data = {
        // name: "Root",
        name: this.itemClicked,
        children: []
      }
      generateLevel(data, this.itemClicked, 0);

      series.data.setAll(this.subjectSelected);
      series.set("selectedDataItem", series.dataItems[0]);

      // series.slices.template.setAll({
      //   fontSize: 30,
      // });
      // series.slices.template.adapters.add("fill", function(fill, target) {
      //   return am5.color(0xff0000);
      // });
      // series.slices.template.adapters.add("stroke", function(fill, target) {
      //   return am5.color(0xff0000);
      // });

      function generateLevel(data, name, level) {
        for (let i = 0; i < Math.ceil(maxNodes * Math.random()) + 1; i++) {
          let nodeName = name;
          let child;
          if (level < maxLevels) {
            child = {
              name: nodeName + level
            }

            if (level > 0 && Math.random() < 0.5) {
              child.value = Math.round(Math.random() * maxValue);
            }
            else {
              child.children = [];
              generateLevel(child, nodeName + i, level + 1)
            }
          }
          else {
            child = {
              name: name + i,
              value: Math.round(Math.random() * maxValue)
            }
          }
          data.children.push(child);
        }

        level++;
        return data;
      }
      // Make stuff animate on load
      series.appear(1000, 100);
    },

  }
}
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 600px;
}
</style>
