import nodeSize from '@/lib/D3GraphClient/SubjectGraphUtils/subjectNodeSize'

// Show the text on the nodes
const nodeText = (d) => {
  const text = d.name
  if (text.length > Math.sqrt(nodeSize(d)) * 2.1) return "hidden"
  return "visible"
}
export default nodeText