
// Color for nodes
const subjectFillColors = (d) => {
  const { name, tree_id } = d
  switch(true) {
  case (name === "Engineering Science" || tree_id === 1):
    return "#3182bd"
  case (name === "Humanities and Social Science" || tree_id === 2):
    return "#f02d47"
  case (name === "Natural Science" || tree_id === 3):
    return "#94b72f"
  case (name === "Subject Agnostic" || tree_id === 4):
    return "#f8a841"
  default:
    return "#0096FF"
  }
}
// Color for links
const subjectLinkColors = (d) => {
  const { name, tree_id } = d.source
  switch(true) {
  case (name === "Engineering Science" || tree_id === 1):
    return "#3182bd"
  case (name === "Humanities and Social Science" || tree_id === 2):
    return "#f02d47"
  case (name === "Natural Science" || tree_id === 3):
    return "#94b72f"
  case (name === "Subject Agnostic" || tree_id === 4):
    return "#f8a841"
  default:
    return "#0096FF"
  }
}

// Color for strokes
const subjectStrokeColors = (d) => {
  const { name, tree_id } = d
  switch(true) {
  case (name === "Engineering Science" || tree_id === 1):
    return "#3182BD19"
  case (name === "Humanities and Social Science" || tree_id === 2):
    return "#F02D4719"
  case (name === "Natural Science" || tree_id === 3):
    return "#94B72F1A"
  case (name === "Subject Agnostic" || tree_id === 4):
    return "#F8A8411A"
  default:
    return "#0096FF1A"
  }
}

export {
  subjectFillColors,
  subjectLinkColors,
  subjectStrokeColors
}

