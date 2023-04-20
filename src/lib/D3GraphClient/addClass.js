// Add class to node
const addClass = (d)=> {
  if (d._children?.length || d.children?.length) return "node"
  return "node noChlid"
}

export default addClass