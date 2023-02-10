const state = {
  filtersType: [],
};

const mutations = {
  filtersSelected (state, filters) {
    state.filtersType = filters
  },
};

const getters = {
  getFilters(state)  {
    return state.filtersType;
  },
}
const addOnFilterSelectedStore = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default addOnFilterSelectedStore