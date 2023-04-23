import * as d3 from "d3";
import dimensions from "@/data/dimension.json"
import {tick} from "@/lib/D3GraphClient/updateTick";

//Add d3 force graph on the page
const forceGraph = () => {
  return d3.layout.force()
    .on("tick", (d) => tick(d, dimensions))
    .size([dimensions["width"], dimensions["height"]]);
}
export default forceGraph