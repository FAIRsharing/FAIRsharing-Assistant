const state = {
  topResourceType: "",
  resourceType: "",
  allResources: [],
  subjectType: "",
  subjectList: [],
  allSubjects: false,
  domainType: "",
  domainList: [],
  nodeSelected: {}
};

const actions = {
  resetAllSelectedValues({commit}) {
    commit('resetAllBubbles');
  },
  resetAllSubjects({commit}) {
    commit('resetAllSubjects');
  },
  resetNodeSelected({commit}) {
    commit('resetNodeSelected');
  },
  resetAllResources({commit}) {
    commit('resetAllResources');
  }
}

const mutations = {
  resourceSelected (state, resource) {
    state.topResourceType = resource["topResourceSelected"]
    state.resourceType = resource["childResourceSelected"]
    if (resource["parent"]) {
      state.nodeSelected = {
        records: resource["topResourceSelected"],
        recordsNumber: resource["recordsNumber"],
        type: "resourceParent"
      }
    }
    else if (resource["child"]){
      state.nodeSelected = {
        records: resource["childResourceSelected"],
        recordsNumber: resource["recordsNumber"],
        type: "resource"
      }
    }

    const found = state.allResources.find(({records}) => records === resource["childResourceSelected"])
    if(!found) {
      state.allResources.push({
        registry : resource["topResourceSelected"],
        records : resource["childResourceSelected"],
        recordsNumber: resource["recordsNumber"],
        type: "resource"
      })
    }
  },
  subjectSelected (state, subject) {
    state.subjectType = subject["subjectSelected"]
    state.nodeSelected = {
      records: subject["subjectSelected"],
      recordsNumber: subject["recordsNumber"],
      type: "subject"
    }
    /* istanbul ignore next */
    const found = state.subjectList.find(({records}) => records === state.subjectType)

    /* istanbul ignore else */
    if(!found) {
      state.subjectList.push({
        records: subject["subjectSelected"],
        recordsNumber: subject["recordsNumber"],
        type: "subject"
      })
    }
  },
  allSubjectsSelected (state, allSubjects) {
    state.allSubjects = allSubjects
  },
  domainSelected (state, domain) {
    state.domainType = domain["domainSelected"]
    state.nodeSelected = {
      records: domain["domainSelected"],
      recordsNumber: domain["recordsNumber"],
      type: "domain"
    }
    /* istanbul ignore next */
    const found = state.domainList.find(({records}) => records === state.domainType)

    /* istanbul ignore else */
    if(!found) {
      state.domainList.push({
        records: domain["domainSelected"],
        recordsNumber: domain["recordsNumber"],
        type: "domain"
      })
    }
  },
  resetAllSubjects(state) {
    state.allSubjects = false
  },
  resetNodeSelected(state) {
    state.nodeSelected = {}
  },
  resetAllResources(state) {
    state.allResources = [],
    state.topResourceType = "",
    state.resourceType = ""
  },
  resetAllBubbles(state) {
    state.topResourceType = "",
    state.resourceType = "",
    state.allResources = [],
    state.subjectType = "",
    state.subjectList = [],
    state.allSubjects = false,
    state.domainType = "",
    state.domainList = [],
    state.nodeSelected = {}
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
  getNodes(state)  {
    return state.nodeSelected;
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