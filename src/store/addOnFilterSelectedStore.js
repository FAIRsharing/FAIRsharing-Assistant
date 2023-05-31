const state = {
  filtersType: [],
};

const actions = {
  resetFiltersSelected({commit}) {
    commit('resetFiltersSelected');
  }
}

const mutations = {
  filtersSelected (state, filters) {
    state.filtersType = filters
  },
  resetFiltersSelected (state) {
    state.filtersType = []
  }

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
  actions
}

export default addOnFilterSelectedStore