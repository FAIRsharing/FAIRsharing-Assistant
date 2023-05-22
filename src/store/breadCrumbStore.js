const state = {
  breadCrumbs: [],
};

const actions = {
  resetbreadCrumbs({commit}) {
    commit('resetbreadCrumbs');
  }
}

const mutations = {
  displayBreadCrumbs (state, breadcrumb) {
    state.breadCrumbs = breadcrumb
  },
  resetbreadCrumbs(state) {state.breadCrumbs = []}
};

const getters = {
  getBreadCrumbs(state)  {
    return state.breadCrumbs?.length ? state.breadCrumbs : null;
  },
}
const breadCrumbStore = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default breadCrumbStore