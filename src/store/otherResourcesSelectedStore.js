const state = {
  otherResourceType: [],
};

const actions ={
  resetOtherResourceSelected({commit}) {
    commit('resetOtherResourceSelected');
  }
}

const mutations = {
  otherResourceSelected (state, otherResources) {
    // state.otherResourceType.findIndex(x => x.name == otherResources.name) == -1 ? state.otherResourceType.push(...otherResources) : console.log("object already exists")
    state.otherResourceType = otherResources
  },

  resetOtherResourceSelected () {
    state.otherResourceType = []
  }

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
  actions
}

export default otherResourcesSelectedStore