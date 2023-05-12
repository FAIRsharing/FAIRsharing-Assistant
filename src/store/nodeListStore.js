const state = {
  nodeList: [],
  nodeFound: false
};

const mutations = {
  nodeLists (state, nodeItem) {
    const found = state.nodeList.find(({records}) => records === nodeItem["records"])
    /* istanbul ignore else */
    if(!found) {
      state.nodeList.push(nodeItem)
      state.nodeFound = false
    }
    else {
      state.nodeFound = true
    }
  },
  deleteNode(state, node) {
    state.nodeList.splice(state.nodeList.indexOf(node), 1)
  }

};

const getters = {
  getNodeList(state)  {
    return state.nodeList;
  },
  getNodeFound(state)  {
    return state.nodeFound;
  }
}
const nodeListStore = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default nodeListStore