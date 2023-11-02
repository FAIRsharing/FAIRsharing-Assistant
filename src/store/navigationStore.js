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
    state.breadcrumbs[breadcrumb.link] = breadcrumb;
  },
  removeBreadcrumb(state, breadcrumb) {
    delete state.breadcrumbs[breadcrumb.link];
  },
  sliceBreadcrumb(state, position) {
    let posNum = Number.parseInt(position.replace('/',''));
    Object.keys(state.breadcrumbs).forEach(function(key) {
      let keyPos = Number.parseInt(key.replace('/',''));
      if (keyPos >= posNum) {
        delete state.breadcrumbs[key];
      }
    })
  },
  setRouteQuery(state, params) {
    let link = params[0];
    let query = params[1]
    state.routeQueries[link] = query;
  },
  clearPreviousNavigation(state, link) {
    let posNum = Number.parseInt(link.replace('/',''));
    Object.keys(state.routeQueries).forEach(function(key) {
      let keyPos = Number.parseInt(key.replace('/',''));
      if (keyPos >= posNum) {
        delete state.routeQueries[key];
      }
    })
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
