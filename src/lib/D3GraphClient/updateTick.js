import * as d3 from "d3";
import {addClass, flatten, nodeDistance, fontSize, click, nodeText, showTooltip, hideTooltip, nodeColors, linkColors, nodeSize} from "@/lib/D3GraphClient";

let node, link, text, tooltip;

const update = (root, force, svg, divSelected, routeName) => {
  const nodes = flatten(root)
  const links = d3.layout.tree().links(nodes);
  // Restart the force layout.
  force
    .nodes(nodes)
    .links(links)
    .charge(nodeDistance(routeName))
    .linkDistance(50)
    .friction(0.5)
    .gravity(0.6)
    .theta(0.8)
    .alpha(0)
    .start();

  // Update the links…
  link = svg.selectAll("line.link")
    .data(links, (d) => d.target.name)
    .style("fill", linkColors(routeName))
    .style("stroke", linkColors(routeName))

  // Enter any new links.
  link.enter().insert("line", ".node")
    .attr("class", "link")
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y)
    .style("fill", linkColors(routeName))
    .style("stroke", linkColors(routeName))
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
    .data(nodes, (d) => d.name)
    .style(nodeColors(routeName))

  // Enter any new nodes.
  node.enter().append("svg:circle")
    .attr({
      "class": addClass,
      "cx": (d) => d.x,
      "cy": (d) => d.y,
      "r":  nodeSize(routeName),
    })
    .style(nodeColors(routeName))
    .style("opacity", (d) => {
      return d.level === 0 ? 0 : 1;
    })
    .style("visibility", (d) => {
      return d.level === 0 ? "hidden" : "visible";
    })
    .on("click", (d) => click(d, root, force, svg,
      tooltip, divSelected, routeName))
    .on("mouseover", (d) => showTooltip(d, tooltip, routeName))
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
    .style("visibility", nodeText)
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

export {update, tick}