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