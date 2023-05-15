const state = {
  nodeList: [],
  nodeFound: false
};

const actions = {
  resetNodeLists({commit}) {
    commit('resetNodeLists');
  }
}

const mutations = {
  nodeLists (state, nodeItem) {
    const found = state.nodeList.find(({records}) => records === nodeItem["records"])
    if(!found) {
      state.nodeList.push(nodeItem)
      state.nodeFound = false
    }
    else {
      state.nodeFound = true
    }
  },
  deleteNode(state, nodeItem) {
    state.nodeList.splice(state.nodeList.indexOf(nodeItem), 1)
  },
  resetNodeLists(state) {
    state.nodeList = []
  },

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
  actions
}

export default nodeListStore