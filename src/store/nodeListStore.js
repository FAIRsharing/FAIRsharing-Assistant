const state = {
  nodeList: [],
};

const mutations = {
  nodeLists (state, nodeItem) {
    const found = state.nodeList.find(({name}) => name === nodeItem["name"])
    /* istanbul ignore else */
    if(!found) {
      state.nodeList.push(nodeItem)
    }
  },

};

const getters = {
  getNodeList(state)  {
    return state.nodeList;
  }
}
const nodeListStore = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default nodeListStore