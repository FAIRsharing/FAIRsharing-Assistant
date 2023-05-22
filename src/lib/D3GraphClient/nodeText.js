import {subjectNodesSize} from '@/lib/D3GraphClient/SubjectGraphUtils'

// Show the text on the nodes
const nodeText = (d) => {
  const text = d.name
  if (text.length > Math.sqrt(subjectNodesSize(d)) * 2.1) return "hidden"
  return "visible"
}
export default nodeText