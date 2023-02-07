const state = {
  topResourceType:"",
  resourceType: "",
  allResources: [],
  subjectType: "",
  domainType: ""
};

const mutations = {
  resourceSelected (state, resource) {
    state.topResourceType = resource["topResourceSelected"]
    state.resourceType = resource["childResourceSelected"]
    const found = state.allResources.find(({records}) => records === resource["childResourceSelected"])
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
  domainSelected (state, domain) {
    state.domainType = domain
  }
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
  getDomain(state)  {
    return state.domainType;
  },
}
const bubbleSelectedStore = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default bubbleSelectedStore