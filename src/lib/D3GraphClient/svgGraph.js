import * as d3 from "d3";
import dimensions from "@/data/dimension.json"

//Append svg on the page
const svgGraph = (divSelected) => {
  return d3.select(divSelected).append("svg")
    .attr("width", dimensions["width"])
    .attr("height", dimensions["height"])
    .attr("preserveAspectRatio", "xMaxYMax meet")
    .classed("svg-content", true);
}
export default svgGraph