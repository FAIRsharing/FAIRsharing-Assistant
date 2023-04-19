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
      ref="chartdiv"
      class="bubbleChart"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import * as d3 from 'd3'
import StringMixin from "@/utils/stringMixin.js"
import RecordTypes from "@/utils/recordTypes.js";
import Loaders from "@/components/Loaders/Loaders"
import calculateRecords from "@/utils/calculateRecords";
export default {
  name: 'SubjectType',
  components: { Loaders },
  mixins: [StringMixin, RecordTypes, calculateRecords],
  data:() => {
    return {
      loading: false,
      fairSharingButton: false,
      showSubjectSelected: false,
      resourceSelected: "" || [],
      domainSelected: "",
      allSubjectsData: {},
      itemClicked: ""
    }
  },
  computed:{
    ...mapGetters("bubbleSelectedStore", ['getTopResource','getResource','getSubject', 'getDomain']),
    ...mapGetters("addOnFilterSelectedStore", ["getFilters"]),
    ...mapState("recordTypeStore", ["allRecordTypes", "loadingData"]),
    ...mapState("variableTagStore", ["variableResponse", "loadingStatus"]),
    ...mapState("browseSubjectsStore", ["subjectBubbleTree", "loadingData"]),
    ...mapState("topSubjectStore", ["topSubjectBubbleTree", "loadingData"]),
  },
  async mounted() {
    this.$nextTick(async () =>{
      this.loading = true
      await this.displaySubjects()
      await this.d3Chart()
      this.loading = false
    })
  },
  destroyed() {
    this.leavePage()
    this.resetVariableTags()
    this.resetRecords()
  },
  methods: {
    ...mapActions("browseSubjectsStore", ["fetchTerms", "leavePage"]),
    ...mapActions("topSubjectStore", ["fetchTopSubjectTerms"]),
    ...mapActions("variableTagStore", ["fetchVariableTags", "resetVariableTags"]),
    ...mapActions("recordTypeStore", ["fetchAllRecordTypes", "resetRecords"]),

    onBubbleSelection() {
      this.fairSharingButton = true
      this.showSubjectSelected = true
      this.$emit('enableFairSharingButton', this.fairSharingButton)
      this.$emit('showSubjectSelected', this.showSubjectSelected)
    },

    async displaySubjects() {
      //When user lands on subject type after selecting the TopResource & domainType type
      if(this.getTopResource !== '' && this.getResource === '' && this.getDomain !== ''){
        // eslint-disable-next-line no-console
        console.log("TOP RESOURCE & DOMAIN")
        await this.allOtherRecordTypes(this.resourceSelected)
        this.domainSelected = this.getDomain.toLowerCase()
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, this.domainSelected, "subject", this.getFilters)
      }

      //When user lands on subject type after selecting the resource & domain type
      if (this.getResource !== '' && this.getDomain !== '') {
        // eslint-disable-next-line no-console
        console.log("OTHER RESOURCE & DOMAIN")
        this.resourceSelected = this.formatString(this.getResource)
        this.domainSelected = this.getDomain.toLowerCase()
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, this.domainSelected, "subject", this.getFilters)
      }

      //When user lands on subject type after selecting the TOP Resource type
      if(this.getTopResource !== '' && this.getResource === '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ONLY TOP RESOURCE")
        await this.allOtherRecordTypes(this.resourceSelected)
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, null, "subject", this.getFilters)
      }
      //When user lands on subject type after selecting the resource type
      if(this.getResource !== '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ONLY OTHER RESOURCE")
        this.resourceSelected = this.formatString(this.getResource)
        this.allSubjectsData = await this.calculateRecords(this.resourceSelected, null, null, "subject", this.getFilters)
      }
      //When user lands on subject type after selecting the domain type
      if (this.getTopResource === '' && this.getResource === '' && this.getDomain !== ''){
        // eslint-disable-next-line no-console
        console.log("ONLY DOMAIN")
        this.domainSelected = this.getDomain.toLowerCase()
        this.allSubjectsData = await this.calculateRecords(null, null, this.domainSelected, "subject", this.getFilters)
      }
      //When user lands on subject type as the entry point in the application
      if(this.getTopResource ==="" && this.getResource === '' && this.getDomain === '') {
        // eslint-disable-next-line no-console
        console.log("ALL SUBJECTS")
        await this.fetchTerms()
        this.allSubjectsData = {
          name: "Subject",
          value: 0,
          children: '',
        }
        this.allSubjectsData["children"] = this.subjectBubbleTree
      }
    },

    async d3Chart() {
      const _module = this
      const width = 1200
      const height = 700
      const radius = 30
      let node, link, root, tooltip, text;

      const force = d3.layout.force()
        .on("tick", tick)
        .size([width, height]);

      const divSelected = this.$refs.chartdiv;
      const svg = d3.select(divSelected).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "xMaxYMax meet")
        .classed("svg-content", true);


      // await this.fetchTerms()
      // const allSubjectsData = {
      //   name: "Subject",
      //   records_count: 0,
      //   children: this.subjectBubbleTree,
      // }
      // root = allSubjectsData

      root = this.allSubjectsData


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
          .alpha(0)
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
        if (text.length > Math.sqrt(nodeSize(d)) * 2) return "hidden"
        return "visible"
      }

      function nodeDistance(d) {
        const { level, tree_id } = d

        if (level === 1) return -30000
        if (level === 2) {
          if (tree_id === 3) return -15000
          return -2000
        }
        if (level === 3 && tree_id === 3) return -3000
        return -1000
      }

      function addClass(d) {
        if (d._children?.length || d.children?.length) return "node"
        return "node noChlid"
      }

      //Size of nodes
      function nodeSize(d) {
        const count = d.records_count
        switch(true) {
        case(count > 7000):
          return Math.sqrt(count) / 0.7
        case(5000 < count && count <= 7000):
          return Math.sqrt(count) / 1.1
        case(2000 <= count && count <= 5000):
          return Math.sqrt(count) / 1.4
        case(1500 <= count && count < 2000):
          return Math.sqrt(count) / 1.1
        case(1000 <= count && count < 1500):
          return Math.sqrt(count) / 1.2
        case(500 <= count && count < 1000):
          return Math.sqrt(count) / 1.1
        case(200 <= count && count < 500):
          return 21
        case(100 <= count && count < 200):
          return 18
        case(20 <= count && count < 100):
          return 12
        case(8 <= count && count < 20):
          return 8
        default:
          return  4
        }
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
          return "#3182BD19"
        case 2:
          return "#F02D4719"
        case 3:
          return "#94B72F1A"
        case 4:
          return "#F8A8411A"
        default:
          return "#87BCE598"
        }
      }

      //Toggle node having children
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
        const nodeClicked = d3.select(this)
        nodeClicked.classed("selectedNode", !nodeClicked.classed("selectedNode"));

        if(_module.itemClicked !== d["name"]) {
          _module.itemClicked = d["name"]
          _module.$store.commit("bubbleSelectedStore/subjectSelected", _module.itemClicked)
        }

        _module.onBubbleSelection()
        hideTooltip()

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
    },
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
    outline-style: dashed;
    outline-width: 1.5px;
    border-radius: 50%;
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
}
</style>
