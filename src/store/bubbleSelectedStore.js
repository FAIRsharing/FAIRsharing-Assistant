const state = {
  topResourceType: "",
  resourceType: "",
  allResources: [],
  subjectType: "",
  subjectList: [],
  allSubjects: false,
  domainType: "",
  domainList: [],
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
    state.subjectType = subject["subjectSelected"]
    /* istanbul ignore next */
    const found = state.subjectList.find(({records}) => records === state.subjectType)

    /* istanbul ignore else */
    if(!found) {
      state.subjectList.push({
        records: subject["subjectSelected"],
        recordsNumber: subject["recordsNumber"]
      })
    }
  },
  allSubjectsSelected (state, allSubjects) {
    state.allSubjects = allSubjects
  },
  domainSelected (state, domain) {
    state.domainType = domain["domainSelected"]
    // /* istanbul ignore next */
    const found = state.domainList.find(({records}) => records === state.domainType)

    /* istanbul ignore else */
    if(!found) {
      state.domainList.push({
        records: domain["domainSelected"],
        recordsNumber: domain["recordsNumber"]
      })
    }
  },
  resetAllSubjects(state) {
    state.allSubjects = false
  },
  resetAllBubbles(state) {
    state.topResourceType = "",
    state.resourceType = "",
    state.allResources = [],
    state.subjectType = "",
    state.subjectList = [],
    state.allSubjects = false,
    state.domainType = "",
    state.domainList = []
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
  getSubjectList(state)  {
    return state.subjectList;
  },
  getAllSubjects(state)  {
    return state.allSubjects;
  },
  getDomain(state)  {
    return state.domainType;
  },
  getDomainList(state)  {
    return state.domainList;
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