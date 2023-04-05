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
      width: 900,
      height: 650,
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
      let node, link, root, tooltip;

      const force = d3.layout.force()
        .on("tick", tick)
        .size([this.width, this.height]);

      const divSelected = this.$refs.chartdiv;
      const vis = d3.select(divSelected).append("svg")
        .attr("width", "100%")
        .attr("height", this.height)
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


      parseLevel(root, 0);
      // Initialize the display to show level 0
      // toggle(root)
      // Initialize the display to show level 1
      root.children.forEach(toggle);

      update();

      function parseLevel(node, level) {
        node.level = level;
        if (node.children && node.children.length) {
          node.children.forEach((children) => {
            parseLevel(children, level + 1);
          });
        }
      }
      function update() {

        const nodes = flatten(root)
        const links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force
          .nodes(nodes)
          .links(links)
          .charge(function (d){
            return d.level >= 2 ? -1000 : -10000
          })
          .linkDistance(50)
          .friction(0.5)
          .start();

        // Update the links…
        link = vis.selectAll("line.link")
          .data(links, (d) => d.target.id)
          .style("fill", linkColor)
          .style("stroke", linkColor)

        // Enter any new links.
        link.enter().insert("line", ".node")
          .attr("class", "link")
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y)
          .style("fill", linkColor)
          .style("stroke", linkColor)
          .style("opacity", (d) => {
            return !d.source.level ? 0 : 1;
          })
          .style("pointer-events", (d) =>{
            return !d.source.level ? "none" : "all";
          });

        // Exit any old links.
        link.exit().remove();

        // Update the nodes…
        node = vis.selectAll("circle.node")
          .data(nodes, (d) => d.id)
          .style("fill", fillColor)
          .style("stroke", strokeColor)
          .style("outline-color", fillColor)

        // Enter any new nodes.
        node.enter().append("circle")
          .attr("class", addClass)
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r",  (d) => {
            return Math.sqrt(d.records_count) / 1 || 30;
          })
          .style("fill", fillColor)
          .style("stroke", strokeColor)
          .style("outline-color", fillColor)
          .style("opacity", (d) => {
            return d.level === 0 ? 0 : 1;
          })
          .style("visibility", (d) => {
            return d.level === 0 ? "hidden" : "visible";
          })
          .on("click", click)
          .on("mouseover", showTooltip)
          .on("mouseout", hideTooltip)
          .call(force.drag);

        // Exit any old nodes.
        node.exit().remove();

        // t = vis.selectAll(".text")
        //   .data(nodes, (d) =>  d.id)
        //   .style("fill", "white")
        //
        // // Enter any new nodes.
        // t.enter().append("text")
        //   .attr("class", "text")
        //   .attr("dx", "25px")
        //   .attr("y", 0)
        //   .text((d) => d.name)
        //   .style("fill", "white")
        //   .attr('text-anchor', "middle")
        //   .style("opacity", (d) => {
        //     return d.level === 0 ? 0 : 1;
        //   })
        //   .style("visibility", (d) => {
        //     return d.level === 0 ? "hidden" : "visible";
        //   })
        //   .call(force.drag);
        //
        // // Exit any old nodes.
        // t.exit().remove();

        //Adding tooltip
        tooltip = d3.select(divSelected).append("div")
          .classed("tooltip", true)
          .style("opacity", 0)

      }

      function tick() {
        link.attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);

        // t.attr("x", (d) => d.x)
        //   .attr("y", (d) => d.y);

      }

      function addClass(d) {
        if (d._children?.length || d.children?.length) return "node"
        return "node noChlid"
      }

      // Color for nodes
      function fillColor(d) {
        switch(d.tree_id) {
        case 1:
          return "#3182bd"
        case 2:
          return "#f02d47"
        case 3:
          return "#94b72f"
        case 4:
          return "#f8a841"
        default:
          return "#87BCE593"
        }
      }

      // Color for links
      function linkColor(d) {
        switch(d.source.tree_id) {
        case 1:
          return "#3182bd"
        case 2:
          return "#f02d47"
        case 3:
          return "#94b72f"
        case 4:
          return "#f8a841"
        default:
          return "#87BCE593"
        }
      }

      function strokeColor(d) {
        switch(d.tree_id) {
        case 1:
          return "#3182BD12"
        case 2:
          return "#F02D4712"
        case 3:
          return "#94B72F11"
        case 4:
          return "#F8A84112"
        default:
          return "#87BCE593"
        }
      }

      function toggle (d) {
        if (d.children && d.children.length) {
          d._children = d.children;
          d._children.forEach((d) => toggle(d));
          d.children = null;
        }
        update(d);
      }

      // Toggle children on click.
      function click(d) {
        if (d3.event.defaultPrevented) return; // ignore drag
        hideTooltip()
        const selectedNode = d3.select(this)
        selectedNode.classed("selectedNode", !selectedNode.classed("selectedNode"));
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
      
      function showTooltip(d){
        if (d.level > 0) {
          tooltip.transition()
            .duration(300)
            .style("opacity", 1) // show the tooltip
          tooltip.html(d.name + ":" + d.records_count)
            .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
            .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
        }
      }

      function hideTooltip() {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0)
      }

      // Returns a list of all nodes under the root.
      function flatten(root) {
        const nodes = [];
        let i = 0;

        function recurse(node) {
          if (node.children) {
            node.children.forEach(recurse);
          }
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
    stroke-width: 8px;
    //stroke-dasharray: 3;
    outline-style: dashed;
    outline-width: 1.5px;
    border-radius: 50%;
    //&:hover{
    //  animation: dash 2s linear forwards;
    //    -webkit-animation: dash 2s linear forwards;
    //  }
  }
  .selectedNode {
    outline-style: solid;
  }
  .noChlid {
    stroke-width: 0;
    outline-style: none;
    cursor: default
  }
  .link {
    fill: none;
    stroke: #9ecae1;
    stroke-width: 1.5px;
  }

  .tooltip {
    position: absolute;
    text-align: center;
    padding: 5px;
    font-size: 16px;
    background: honeydew;
    border: 1px solid honeydew;
    border-radius: 8px;
    pointer-events: none; /* keep the mouseover when over the tooltip */
  }
  @keyframes dash {
    0%{
      stroke-dashoffset:0;
      stroke-dasharray:0;
    }
    100% {
      stroke-dashoffset:3;
      stroke-dasharray:3;
    }
  }
  @-webkit-keyframes dash {
    0%{
      stroke-dashoffset:0;
      stroke-dasharray:0;
    }
    100% {
      stroke-dashoffset:3;
      stroke-dasharray:3;
    }
  }
}
</style>


