import * as d3 from "d3";
import {update, hideTooltip, storeNode, breadcrumb} from "@/lib/D3GraphClient";

// When a node is clicked
const click = (d, root, force, svg, tooltip, divSelected, routeName) => {
  if (d3.event.defaultPrevented) return; // ignore drag
  const nodeClicked = d3.event.target
  nodeClicked.classList.toggle("selectedNode")
  storeNode(d, routeName)
  hideTooltip(tooltip)
  breadcrumb(d, root)
  if (d.children && d.children.length) {
    toggle(d)
    d.children = null;
  }
  else {
    d.children = d._children;
    d._children = null;
  }
  update(root, force, svg, divSelected, routeName);
}

//Toggle node having children
const toggle = (d) => {
  if (d.children && d.children.length) {
    d._children = d.children;
    d._children.forEach((d) => toggle(d));
    d.children = null;
  }
}

export  { click, toggle }