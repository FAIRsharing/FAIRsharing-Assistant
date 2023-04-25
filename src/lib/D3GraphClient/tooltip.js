import * as d3 from "d3";
import { tooltipColors } from "@/lib/D3GraphClient";

//Show tooltip on mouse-in
const showTooltip = (d, tooltip, routeName) =>{
  if (d.level > 0) {
    tooltip
      .transition()
      .duration(300)
      .style("opacity", 0.9) // show the tooltip
      .style("background-color", tooltipColors(d, routeName))
    tooltip
      .html(d.name + ": " + d.records_count)
      .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth + 100) + "px")
      .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
  }
}

//Hide tooltip on mouse-out
const hideTooltip = (tooltip) => {
  tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
}

export {showTooltip, hideTooltip}