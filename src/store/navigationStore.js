const state = {
  previousLocation: null,
  compliantWith: null,
  breadcrumbs: [],
  routeQueries: {}
}

const mutations = {
  setNavigationState(state, location) {
    state.previousLocation = location;
  },
  setComplianceState(state, compliantWith) {
    state.compliantWith = compliantWith;
  },
  pushBreadcrumb(state, breadcrumb) {
    if (state.breadcrumbs.some(e => e.link === breadcrumb.link)) {
      return; // Don't push if it's already there.
    }
    state.breadcrumbs.push(breadcrumb)
  },
  popBreadcrumb(state) {
    state.breadcrumbs.pop();
  },
  sliceBreadcrumb(state, position) {
    state.breadcrumbs = state.breadcrumbs.slice(0, position);
  },
  setRouteQuery(state, link, query) {
    state.routeQueries[link] = query;
  },
  clearNavigation(state) {
    state.previousLocation = null;
    state.compliantWith = null;
    state.breadcrumbs = [];
    state.routeQueries = {}
  }
}

const getters = {
  getPreviousLocation(state) {
    return state.previousLocation;
  },
  getCompliantWith(state) {
    return state.compliantWith
  },
  getBreadcrumbs(state) {
    return state.breadcrumbs
  },
  getRouteQuery(state) {
    return state.routeQueries;
  }
}


const navigationStore = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default navigationStore
