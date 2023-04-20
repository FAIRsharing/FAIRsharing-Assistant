import nodeSize from '@/lib/D3GraphClient/SubjectGraphUtils/subjectNodeSize'
// Size of text in nodes
const fontSize = (d) => {
  return Math.sqrt(nodeSize(d)) * 2 + "px"
}

export default fontSize