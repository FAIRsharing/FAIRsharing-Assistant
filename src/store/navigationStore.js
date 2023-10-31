const state = {
  previousLocation: null,
  compliantWith: null,
  breadcrumbs: {},
  routeQueries: {}
}

const mutations = {
  setNavigationState(state, location) {
    state.previousLocation = location;
  },
  setComplianceState(state, compliantWith) {
    state.compliantWith = compliantWith;
  },
  addBreadcrumb(state, breadcrumb) {
    console.log("Crumb: " + JSON.stringify(breadcrumb));
    console.log("Before: " + JSON.stringify(state.breadcrumbs));
    state.breadcrumbs[breadcrumb.link] = breadcrumb;
    console.log("After: " + JSON.stringify(state.breadcrumbs));
  },
  removeBreadcrumb(state, breadcrumb) {
    delete state.breadcrumbs[breadcrumb.link];
  },
  sliceBreadcrumb(state, position) {
    console.log("POS: " + position);
    console.log("BC: " + JSON.stringify(state.breadcrumbs));
    console.log("Sliced: " + JSON.stringify(state.breadcrumbs.slice(0, position)));
    state.breadcrumbs = state.breadcrumbs.slice(0, position);
    console.log("BCA: " + JSON.stringify(state.breadcrumbs));
  },
  setRouteQuery(state, link, query) {
    state.routeQueries[link] = query;
  },
  clearNavigation(state) {
    state.previousLocation = null;
    state.compliantWith = null;
    state.breadcrumbs = {};
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
