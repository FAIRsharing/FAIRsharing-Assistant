const state = {
  previousLocation: null,
  compliantWith: null,
  compliantWithPolicy: null,
  role: null,
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
  setPolicyComplianceState(state, compliantWithPolicy) {
    state.compliantWithPolicy = compliantWithPolicy;
  },
  setRole(state, role) {
    state.role = role;
  },
  addBreadcrumb(state, breadcrumb) {
    state.breadcrumbs[breadcrumb.link] = breadcrumb;
  },
  removeBreadcrumb(state, breadcrumb) {
    delete state.breadcrumbs[breadcrumb.link];
  },
  sliceBreadcrumb(state, position) {
    // The assumption here is that the keys will be in order. Thus, one might go through all from the
    // start and delete any including and after the destination.
    let seen = false;
    Object.keys(state.breadcrumbs).forEach(function(key) {
      if (key === position) {
        seen = true;
      }
      if (seen) {
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
    let seen = false;
    Object.keys(state.routeQueries).forEach(function(key) {
      if (key.replace('/','') === link.replace('/','')) {
        seen = true;
      }
      if (seen) {
        delete state.routeQueries[key];
      }
    })
  },
  clearNavigation(state) {
    state.previousLocation = null;
    state.compliantWith = null;
    state.compliantWithPolicy = null;
    state.role = null;
    state.breadcrumbs = {};
    state.routeQueries = {}
  }
}

const getters = {
  getPreviousLocation(state) {
    if (!state.previousLocation) {
      return '/0'
    }
    return state.previousLocation;
  },
  getCompliantWith(state) {
    return state.compliantWith
  },
  getCompliantWithPolicy(state) {
    return state.compliantWithPolicy
  },
  getBreadcrumbs(state) {
    return state.breadcrumbs
  },
  getRouteQuery(state) {
    return state.routeQueries;
  },
  getRole(state) {
    return state.role;
  }
}


const navigationStore = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default navigationStore
