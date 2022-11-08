<template>
<div>
  <p v-if="subjectSelected">Subject Type Selected: {{subjectSelected}}</p>
  <p>Resource Type Selected Backup: {{itemClicked}}</p>
  <div class="charts" ref="chartdiv">
  </div>
</div>

</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { resourcetype } from '@/data'

export default {
  name: 'ResourceType',
  data:() => {
    return {
      fakedata: resourcetype,
      itemClicked: "",
    }
  },
  props:[
    "subjectSelected",
  ],
  mounted() {
    if(this.subjectSelected) console.log("this.subjectSelected::", this.subjectSelected)
    this.getCircles()
  },
  methods: {
    getCircles() {
      // Create root element
      let root = am5.Root.new(this.$refs.chartdiv);

      //To remove amcharts logo
      root._logo.dispose()

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);


      // Set data
      let data = this.fakedata;
      // Create wrapper container
      let container = root.container.children.push(am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      }));

      // Create series
      let series = container.children.push(am5hierarchy.ForceDirected.new(root, {
          focusable: true,
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
        const itemName = e.target.dataItem.dataContext.name
        if( this.itemClicked !== itemName && !basicResourceTypes.includes(itemName)) {
          this.itemClicked = itemName
          this.$emit('resourceTypeSelected', this.itemClicked);
        }
      });

      series.links.template.set("strength", 0.5);
      series.data.setAll([data]);
      series.set("selectedDataItem", series.dataItems[0]);
      series.appear(1000, 100); // Make stuff animate on load

      // Add Breadcrumbs
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
  height: 600px;
}
</style>
