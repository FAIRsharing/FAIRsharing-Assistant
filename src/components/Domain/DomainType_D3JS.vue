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
import d3data from "@/data/domain.json"
import * as d3 from 'd3'
import {mapActions, mapGetters, mapState} from "vuex";
import Loaders from "@/components/Loaders/Loaders"
import colors from "@/data/colors.json"

export default {
  name: 'DomainTypeD3JS',
  components: { Loaders },
  data:() => {
    return {
      loading: false,
      d3data: d3data,
      colors: colors.colors
    }
  },
  computed:{
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    ...mapGetters("addOnFilterSelectedStore", ["getFilters"]),
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
    ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),
    ...mapActions("browseSubjectsStore", ["fetchTerms"]),

    async d3Chart() {
      let node, link, root, tooltip, text;
      const width = 1200
      const height = 700
      const radius = 30
      const colors = this.colors
      const force = d3.layout.force()
        .on("tick", tick)
        .size([width, height]);

      var divSelected = this.$refs.chartdiv;
      var svg = d3.select(divSelected).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-content", true);


      // await this.fetchVariableTags([["knowledgebase_and_repository", "knowledgebase", "repository"], null, null, "domain", this.getFilters])
      const allDomainData = {
        name: "Domain",
        records_count: 0,
        // children: this.variableResponse,
        children: this.d3data.data.variableFilter.data,
      }
      root = allDomainData

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
          .charge(nodeDistance)
          .linkDistance(50)
          .friction(0.5)
          .gravity(0.6)
          .theta(0.8)
          .alpha(0.1)
          .start();

        // Update the links…
        link = svg.selectAll("line.link")
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
        node = svg.selectAll("circle.node")
          .data(nodes, (d) => d.id)
          .style("fill", fillColor)
          .style("stroke", strokeColor)
          .style("outline-color", fillColor)

        // Enter any new nodes.
        node.enter().append("svg:circle")
          .attr("class", addClass)
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r",  nodeSize)
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

        //Text on the nodes
        text = svg.selectAll(".text")
          .data(nodes, (d) =>  d.id)
          .style("fill", "white")

        // Enter any new nodes.
        text.enter().append("svg:text")
          .attr("class", "text")
          .attr("dx", 0)
          .attr("y", 0)
          .attr('text-anchor', "middle")
          .attr('alignment-baseline', "middle")
          .text((d) => d.name)
          .style("fill", "white")
          .style("font-size", fontSize)
          .style("opacity", (d) => {
            return d.level === 0 ? 0 : 1;
          })
          .style("visibility", showText)
          .call(force.drag)

        // Exit any old nodes.
        text.exit().remove();

        //Adding tooltip
        tooltip = d3.select(divSelected).append("div")
          .classed("tooltip", true)
          .style("opacity", 0)
      }

      function tick() {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        // node.attr("cx", (d) => d.x)
        //   .attr("cy", (d) => d.y);
        // Restrict nodes within svg area
        node
          .attr("cx", (d) => {
            return d.x = Math.max(radius, Math.min(width - radius, d.x))
          })
          .attr("cy", (d) => {
            return d.y = Math.max(radius, Math.min(height - radius, d.y))
          });

        text
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y);

      }

      function fontSize(d) {
        return Math.sqrt(nodeSize(d)) * 2 + "px"
      }

      function showText(d) {
        const text = d.name
        if (text.length > Math.sqrt(nodeSize(d)) * 2.1) return "hidden"
        return "visible"
      }
      function nodeDistance(d) {
        const { level, records_count } = d
        if (level === 1) return -5000
        if (300 <= records_count) {
          if (level === 2) return -4000
          if (level === 3) return -7000
        }
        return -2000

      }

      function addClass(d) {
        if (d._children?.length || d.children?.length) return "node"
        return "node noChlid"
      }

      //Size of nodes
      function nodeSize(d) {
        const count = d.records_count
        switch(true) {
        case(count > 500):
          return 70
        case(450 <= count && count < 500):
          return 65
        case(400 <= count && count < 450):
          return 60
        case(350 <= count && count < 400):
          return 55
        case(300 <= count && count < 350):
          return 50
        case(250 <= count && count < 300):
          return 45
        case(200 <= count && count < 250):
          return 40
        case(150 <= count && count < 200):
          return 35
        case(100 <= count && count < 150):
          return 30
        case(70 <= count && count < 100):
          return 25
        case(40 <= count && count < 70):
          return 20
        case(20 <= count && count < 40):
          return 15
        case(10 <= count && count < 20):
          return 12
        default:
          return  8
        }
      }


      // Color for nodes
      function fillColor(d) {
        for (let i = 0; i< colors.length; i++) {
          if (d.tree_id === i) return colors[i]
        }
      }

      // Color for links
      function linkColor(d) {
        for (let i = 0; i< colors.length; i++) {
          if (d.source.tree_id === i) return colors[i]
        }
      }

      //Add alpha/opacity to colors
      function addAlpha(color, opacity) {
        // coerce values so ti is between 0 and 1.
        var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
      }

      function strokeColor(d) {
        for (let i = 0; i< colors.length; i++) {
          if (d.tree_id === i) return addAlpha(colors[i], 0.1)
        }
      }

      //Toggle node having children
      function toggle (d) {
        if (d.children && d.children.length) {
          d._children = d.children;
          d._children.forEach((d) => toggle(d));
          d.children = null;
        }
        // update(d);
      }

      // Toggle children on click.
      function click(d) {
        if (d3.event.defaultPrevented) return; // ignore drag
        hideTooltip()
        const itemClicked = d3.select(this)
        console.log("itemClicked::", itemClicked)
        itemClicked.classed("selectedNode", !itemClicked.classed("selectedNode"));
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

      //Show tooltip on node hover
      function showTooltip(d){
        if (d.level > 0) {
          tooltip
            .transition()
            .duration(300)
            .style("opacity", 0.9) // show the tooltip
            .style("background-color", fillColor(d))
          tooltip
            .html(d.name + ": " + d.records_count)
            .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
            .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
        }
      }

      function hideTooltip() {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
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
  .bubbleChart{
    margin: 0 auto;
    text-align: center;
    width:100%;
    max-width: 1024px;
    height: 100%;
    min-height: 650px;
  }
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
    filter: brightness(1.2);
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
    color: white;
    border: 1px solid white;
    border-radius: 4px;
    pointer-events: none; /* keep the mouseover when over the tooltip */
    box-shadow: 10px 6px 17px 0px rgba(145,145,145,0.44);
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


