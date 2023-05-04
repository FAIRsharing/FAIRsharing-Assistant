import breadCrumbStore from "@/store"
const breadcrumb = (d, root) => {
  const breadCrumbArray = pathTo(root, d.name)
  const breadCrumbBar = breadCrumbArray.map(d => d.name).join(" > ")
  breadCrumbStore.commit("breadCrumbStore/displayBreadCrumbs", breadCrumbBar)
}

/**
*
* @param {Object} - name
* @param {Array of Objects } - node (All the nodes)
* @returns {Array}
*/

const pathTo = (node, name, depth = 1) => {
  if (node.name === name) return [];
  let childNodes = node._children?.length ? node._children : node.children
  const hasChild = node.children?.length ? true : false
  if (hasChild) {
    for (let submenu of childNodes) {
      let result = pathTo(submenu, name, depth + 1);
      if (result) {
        return [{
          name: submenu.name
        },
        ...result
        ];
      }
    }
  }
}
export default breadcrumb