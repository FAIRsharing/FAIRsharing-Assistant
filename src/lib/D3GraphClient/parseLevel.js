const parseLevel = (node, level) => {
  node.level = level;
  if (node.children && node.children.length) {
    node.children.forEach((children) => {
      parseLevel(children, level + 1);
    });
  }
}

export default parseLevel