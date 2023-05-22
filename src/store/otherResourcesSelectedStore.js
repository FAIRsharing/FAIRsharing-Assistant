const state = {
  otherResourceType: [],
};

const mutations = {
  otherResourceSelected (state, otherResources) {
    state.otherResourceType = otherResources
  },

};

const getters = {
  getOtherResourceSelected(state)  {
    return state.otherResourceType;
  }
}
const otherResourcesSelectedStore = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default otherResourcesSelectedStore