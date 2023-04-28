
// Color for nodes
const resourceFillColors = (d) => {
  switch(d.tree_id) {
  case 1:
    return "#3182bd"
  case 2:
    return "#f02d47"
  case 3:
    return "#94b72f"
  default:
    return "#87BCE593"
  }
}
// Color for links
const resourceLinkColors = (d) => {
  switch(d.source.tree_id) {
  case 1:
    return "#3182bd"
  case 2:
    return "#f02d47"
  case 3:
    return "#94b72f"
  default:
    return "#87BCE593"
  }
}

// Color for strokes
const resourceStrokeColors = (d) => {
  switch(d.tree_id) {
  case 1:
    return "#3182BD19"
  case 2:
    return "#F02D4719"
  case 3:
    return "#94B72F1A"
  default:
    return "#87BCE598"
  }
}

export {
  resourceFillColors,
  resourceLinkColors,
  resourceStrokeColors
}

