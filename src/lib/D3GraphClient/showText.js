import nodeSize from '@/lib/D3GraphClient/SubjectGraphUtils/subjectNodeSize'

// Show the text on the nodes
const showText = (d) => {
  const text = d.name
  if (text.length > Math.sqrt(nodeSize(d)) * 2) return "hidden"
  return "visible"
}
export default showText