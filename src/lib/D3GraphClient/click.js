import * as d3 from "d3";
import {update, hideTooltip} from "@/lib/D3GraphClient";

// When a node is clicked
const click = (d, root, force, svg, tooltip, divSelected) => {
  if (d3.event.defaultPrevented) return; // ignore drag
  // const nodeClicked = d3.select(this)
  // nodeClicked.classed("selectedNode", !nodeClicked.classed("selectedNode"));

  // if(_module.itemClicked !== d["name"]) {
  //   _module.itemClicked = d["name"]
  //   _module.$store.commit("bubbleSelectedStore/subjectSelected", _module.itemClicked)
  // }

  // _module.onBubbleSelection()
  hideTooltip(tooltip)
  if (d.children) {
    toggle(d)
    d.children = null;
  }
  else {
    d.children = d._children;
    d._children = null;
  }
  update(root, force, svg, divSelected);
}

//Toggle node having children
const toggle = (d) =>{
  if (d.children && d.children.length) {
    d._children = d.children;
    d._children.forEach((d) => toggle(d));
    d.children = null;
  }
  // update();
}

export  { click, toggle }