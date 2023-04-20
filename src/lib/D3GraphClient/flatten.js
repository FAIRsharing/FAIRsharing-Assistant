// Returns a list of all nodes under the root.
const flatten = (root) => {
  const nodes = [];
  let i = 0;
  const recurse = (node) => {
    if (node.children) {
      node.children.forEach(recurse);
    }
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}
export default flatten