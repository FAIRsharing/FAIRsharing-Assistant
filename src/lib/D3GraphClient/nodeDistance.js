// Distance in-between the nodes
const nodeDistance = (d) => {
  const { level, tree_id } = d

  if (level === 1) return -30000
  if (level === 2) {
    if (tree_id === 3) return -15000
    return -2000
  }
  if (level === 3 && tree_id === 3) return -3000
  return -1000
}

export default nodeDistance