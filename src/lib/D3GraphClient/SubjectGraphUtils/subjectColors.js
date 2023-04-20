
// Color for nodes
const fillColor = (d) => {
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
const linkColor = (d) => {
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

// Color for strokes
const strokeColor = (d) => {
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

export {
  fillColor,
  linkColor,
  strokeColor
}

