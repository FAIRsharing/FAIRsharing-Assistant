const state = {
  previousLocation: null,
  compliantWith: null
}

const mutations = {
  setNavigationState(state, location) {
    state.previousLocation = location;
  },
  setComplianceState(state, compliantWith) {
    state.compliantWith = compliantWith;
  },
  clearNavigation(state) {
    state.previousLocation = null;
    state.compliantWith = null;
  }
}

const getters = {
  getPreviousLocation(state) {
    return state.previousLocation;
  },
  getCompliantWith(state) {
    return state.compliantWith
  }
}


const navigationStore = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default navigationStore
