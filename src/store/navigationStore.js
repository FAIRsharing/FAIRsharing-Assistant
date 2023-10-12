const state = {
  previousLocation: null
}

const mutations = {
  setNavigationState(state, location) {
    state.previousLocation = location;
  }
}

const getters = {
  getPreviousLocation(state) {
    return state.previousLocation;
  }
}


const navigationStore = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default navigationStore
