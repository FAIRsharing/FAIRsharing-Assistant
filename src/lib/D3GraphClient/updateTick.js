import * as d3 from "d3";
import {addClass, flatten, nodeDistance, fontSize, click, showText, showTooltip, hideTooltip} from "@/lib/D3GraphClient/index";
import { fillColor, linkColor, strokeColor, nodeSize} from "@/lib/D3GraphClient/SubjectGraphUtils"


let node, link, text, tooltip;
const pathName = window.location.pathname

const update = (root, force, svg, divSelected) => {
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
    .style(colors())

  // Enter any new nodes.
  node.enter().append("svg:circle")
    .attr({
      "class": addClass,
      "cx": (d) => d.x,
      "cy": (d) => d.y,
      "r":  nodeSizes()
    })
    .style(colors())
    .style("opacity", (d) => {
      return d.level === 0 ? 0 : 1;
    })
    .style("visibility", (d) => {
      return d.level === 0 ? "hidden" : "visible";
    })
    .on("click", (d) => click(d, root, force, svg,
      tooltip, divSelected))
    .on("mouseover", (d) => showTooltip(d, tooltip))
    .on("mouseout", () => hideTooltip(tooltip))
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
  tooltip
    .classed("tooltip", true)
    .style("opacity", 0)
}

const tick = (d, dimensions) => {
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
      return d.x = Math.max(dimensions["radius"], Math.min(dimensions["width"] - dimensions["radius"], d.x))
    })
    .attr("cy", (d) => {
      return d.y = Math.max(dimensions["radius"], Math.min(dimensions["height"] - dimensions["radius"], d.y))
    });

  text
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y);

}

const colors = () => {
  if (pathName === "/subject") {
    return ({
      "fill": fillColor,
      "stroke": strokeColor,
      "outline-color": fillColor
    })
  }
}

const nodeSizes = () => {
  if (pathName === "/subject") {
    return nodeSize
  }
}

export {update, tick}