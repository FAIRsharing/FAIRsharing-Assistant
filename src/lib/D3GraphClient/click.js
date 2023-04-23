import * as d3 from "d3";
import {update, hideTooltip} from "@/lib/D3GraphClient";
import bubbleSelectedStore from "@/store"
// import {mapState} from "vuex";

// When a node is clicked
const click = (d, root, force, svg, tooltip, divSelected) => {
  // computed: {
  //   currentRouteName() {
  //     return this.$route.name;
  //   }
  // },
  let itemClicked = ""
  if (d3.event.defaultPrevented) return; // ignore drag
  const nodeClicked = d3.event.target
  nodeClicked.classList.toggle("selectedNode")

  if(itemClicked !== d["name"]) {
    itemClicked = d["name"]
    bubbleSelectedStore.commit("bubbleSelectedStore/subjectSelected", itemClicked)
  }
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