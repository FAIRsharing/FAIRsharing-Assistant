<template>
  <div>
    <div>This is D3 page</div>
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
import d3data from "@/data/subject.json"
import * as d3 from 'd3'
import {mapActions, mapState} from "vuex";
import Loaders from "@/components/Loaders/Loaders.vue"

export default {
  name: 'SubjectTypeD3JS',
  components: { Loaders },
  data:() => {
    return {
      loading: false,
      d3data: d3data,
    }
  },
  computed:{
    ...mapState("browseSubjectsStore", ["subjectBubbleTree", "loadingData"])
  },
  async mounted() {
    await this.d3Chart()
    // this.$nextTick(async () =>{
    //   this.loading = true
    //   await this.d3Chart()
    //   this.loading = false
    // })
  },

  methods: {
    ...mapActions("browseSubjectsStore", ["fetchTerms"]),

    async d3Chart() {
      var w = 1060,
        h = 800,
        node,
        link,
        root,
        t;
      // var COLLAPSE_LEVEL = 1;

      var force = d3.layout.force()
        .on("tick", tick)
        .size([w, h]);

      var divSelected = this.$refs.chartdiv;
      var vis = d3.select(divSelected).append("svg")
        .attr("width", "100%")
        .attr("height", h)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-content", true);


      // await this.fetchTerms()
      // console.log("this.subjectBubbleTree::", this.subjectBubbleTree)
      // const allSubjectsData = {
      //   name: "Subject",
      //   records_count: 0,
      //   children: this.subjectBubbleTree,
      // }
      // root = allSubjectsData

      root = this.d3data


      function parseLevel(node, level) {
        node.level = level;
        if (typeof node.children !== 'undefined') {
          node.children.forEach(function(children) {
            parseLevel(children, level + 1);
          });
        }
      }

      parseLevel(root, 0);
      // Initialize the display to show level 0
      // toggle(root)
      // Initialize the display to show level 1
      root.children.forEach(toggle);

      update();
      function toggle (d) {
        if (d.children && d.children.length) {
          d._children = d.children;
          d._children.forEach((d) => toggle(d));
          d.children = null;
        }
        update(d);
      }

      function update() {

        var nodes = flatten(root)
        var links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force
          .nodes(nodes)
          .links(links)
          .charge(() => {
            return -10000
          })
          .linkDistance(50)
          .friction(0.5)
          .start();

        // Update the links…
        link = vis.selectAll("line.link")
          .data(links, function(d) { return d.target.id; });

        // Enter any new links.
        link.enter().insert("line", ".node")
          .attr("class", "link")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; })
          .style("opacity", function(d){
            return !d.source.level ? 0 : 1;
          })
          .style("pointer-events", function(d){
            return !d.source.level ? "none" : "all";
          });

        // Exit any old links.
        link.exit().remove();

        // Update the nodes…
        node = vis.selectAll("circle.node")
          .data(nodes, function(d) { return d.id; })
          .style("fill", color);

        // Enter any new nodes.
        node.enter().append("circle")
          .attr("class", "node")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function (d) {
            return Math.sqrt(d.records_count) / 1 || 30;
          })
          .style("fill", color)
          .style("opacity", function(d){
            return !d.level ? 0 : 1;
          })
          .style("pointer-events", function(d){
            return !d.level ? "none" : "cursor";
          })
          .on("click", click)
          .call(force.drag);

        // Exit any old nodes.
        node.exit().remove();

        t = vis.selectAll(".t-node")
          .data(nodes, function(d) { return d.id; })
          .style("fill", color);

        // Enter any new nodes.
        t.enter().append("svg:text")
          .attr("class", "t-node")
          .attr("dx", "25px")
          .attr("y", 0)
          .text(function(d){return d.name + " " + (d.level ? d.level:'')})
          .style("opacity", function(d){
            return !d.level ? 0 : 1;
          });
        // .call(force.drag);

        // Exit any old nodes.
        t.exit().remove();

      }

      function tick() {
        link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

        t.attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });

      }

      // Color leaf nodes orange, and packages white or blue.
      function color(d) {
        return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          toggle(d)
          d.children = null;
        }
        else {
          d.children = d._children;
          d._children = null;
        }
        update();
      }

      // Returns a list of all nodes under the root.
      function flatten(root) {
        var nodes = [], i = 0;

        function recurse(node) {
          if (node.children) node.children.forEach(recurse);
          if (!node.id) node.id = ++i;
          nodes.push(node);
        }

        recurse(root);
        return nodes;
      }
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .node {
    cursor: pointer;
    stroke: #3182bd;
    stroke-width: 1.5px;
  }

  .link {
    fill: none;
    stroke: #9ecae1;
    stroke-width: 1.5px;
  }
}
</style>


