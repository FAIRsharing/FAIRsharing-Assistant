import colorGenerator from "@/data/colors.json"

const colors = colorGenerator.colors

// Color for nodes
const domainFillColors = (d) => {
  for (let i = 0; i< colors.length; i++) {
    if (d.tree_id === i) return colors[i]
  }
}
// Color for links
const domainLinkColors = (d) => {
  for (let i = 0; i< colors.length; i++) {
    if (d.source.tree_id === i) return colors[i]
  }
}

// Color for strokes
const domainStrokeColors = (d) => {
  for (let i = 0; i< colors.length; i++) {
    if (d.tree_id === i) return addAlpha(colors[i], 0.1)
  }
}

//Adding alpha/opacity to colors
const addAlpha = (color, opacity) => {
  // coerce values so it is between 0 and 1.
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

export {
  domainFillColors,
  domainLinkColors,
  domainStrokeColors
}

