<template>
  <div>
    <div>This is D3 page</div>
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

export default {
  name: 'DomainTypeD3JS',
  data: () => {
    return {
      d3data: d3data,
    }
  },
  computed: {
    ...mapState("browseSubjectsStore", ["subjectBubbleTree", "loadingData"])
  },
  mounted() {
    this.d3Chart()
  },

  methods: {
    ...mapActions("browseSubjectsStore", ["fetchTerms"]),

    d3Chart() {
      var width = 960,
        height = 700,
        root;

      var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(0).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .on("tick", tick)

      var divSelected = this.$refs.chartdiv;
      var svg = d3.select(divSelected).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `${-width/2} ${-height/2} ${width*2} ${height*2}`);

      var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");
      root = d3.hierarchy(this.d3data);
      collapse(root)
      update();


      function update() {

        var nodes = flatten(root);
        // var tree = d3.tree();
        var links = root.links(nodes)

        // Restart the force layout.
        simulation
          .nodes(nodes)
          .force("link").links(links)

        // Update the links…
        link = link.data(links, function (d) {
          return d.target.id;
        });

        // Exit any old links.
        link.exit().remove();

        // Enter any new links.
        link.enter().insert("line", ".node")
          .attr("class", "link")
          .attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        // Update the nodes…
        node = node.data(nodes, function (d) {
          return d.id;
        }).style("fill", color);

        // Exit any old nodes.
        node.exit().remove();

        // Enter any new nodes.
        node.enter().append("circle")
          .attr("class", "node")
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          })
          .attr("r", function (d) {
            return Math.sqrt(d.records_count) / 1 || 10;
          })
          .style("fill", color)
          .on("click", click)
      }

      function tick() {
        link.attr("x1", function (d) {
          return d.source.x;
        })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        node.attr("cx", function (d) {
          return d.x;
        })
          .attr("cy", function (d) {
            return d.y;
          });
      }

      // Color leaf nodes orange, and packages white or blue.
      function color(d) {
        return d._children?.length ? "#3182bd" : d.children?.length ? "#c6dbef" : "#fd8d3c";
      }

      //Collapse all child nodes
      function collapse(d) {
        if (d.children && d.children.length) {
          d._children = d.children;
          d._children.forEach((d) => collapse(d));
          d.children = null;
        }
        update();
      }

      // Toggle children on click.
      function click(d) {
        // if (!d3.event.defaultPrevented) {
        if (d.children && d.children.length) {
          collapse(d);
          // d._children = d.children;
          d.children = null;
        }
        else {
          d.children = d._children;
          d._children = null;
        }
        update();
        // }
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

      // function collapseSingle(d) {
      //   if (d.children && d.children.length) {
      //     d._children = d.children;
      //     d.children = null;
      //   }
      // }
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

