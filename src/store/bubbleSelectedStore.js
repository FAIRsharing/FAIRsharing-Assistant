const state = {
  topResourceType: "",
  resourceType: "",
  allResources: [],
  subjectType: "",
  allSubjects: false,
  domainType: "",
};

const actions = {
  resetAllSelectedValues({commit}) {
    commit('resetAllBubbles');
  },
  resetAllSubjects({commit}) {
    commit('resetAllSubjects');
  }
}

const mutations = {
  resourceSelected (state, resource) {
    state.topResourceType = resource["topResourceSelected"]
    state.resourceType = resource["childResourceSelected"]
    /* istanbul ignore next */
    const found = state.allResources.find(({records}) => records === resource["childResourceSelected"])
    /* istanbul ignore else */
    if(!found) {
      state.allResources.push({
        registry : resource["topResourceSelected"],
        records : resource["childResourceSelected"],
        recordsNumber: resource["recordsNumber"]
      })
    }
  },
  subjectSelected (state, subject) {
    state.subjectType = subject
  },
  allSubjectsSelected (state, allSubjects) {
    state.allSubjects = allSubjects
  },
  domainSelected (state, domain) {
    state.domainType = domain
  },
  resetAllSubjects(state) {
    state.allSubjects = false
  },
  resetAllBubbles(state) {
    state.topResourceType = "",
    state.resourceType = "",
    state.allResources = [],
    state.subjectType = "",
    state.allSubjects = false,
    state.domainType = ""
  },
};

const getters = {
  getTopResource(state)  {
    return state.topResourceType;
  },
  getResource(state)  {
    return state.resourceType;
  },
  getAllResources(state)  {
    return state.allResources;
  },
  getSubject(state)  {
    return state.subjectType;
  },
  getAllSubjects(state)  {
    return state.allSubjects;
  },
  getDomain(state)  {
    return state.domainType;
  },
}
const bubbleSelectedStore = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default bubbleSelectedStore