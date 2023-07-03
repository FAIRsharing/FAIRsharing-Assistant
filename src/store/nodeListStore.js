const state = {
  nodeList: {
    resourceNodeList: [],
    subjectNodeList: [],
    domainNodeList: [],

  },
  nodeFound: {
    isResourceNode: false,
    isSubjectNode: false,
    isDomainNode: false,

  },
  filters: {
    filtersList: [],
    isFilter: false
  }
};
/**
 *
 * @param recordArray - array of records
 * @param nodeItem - Object of a record
 * @returns {Object}
 */
const isNodePresent = (recordArray, nodeItem) => {
  return recordArray.find(({records}) => records === nodeItem["records"])
}

/**
 *
 * @param recordArray - array of records
 * @param nodeItem - Object of a record
 * @returns {Array}
 */
const deleteNode = (recordArray, nodeItem) => {
  return recordArray.splice(recordArray.indexOf(nodeItem), 1)
}

const actions = {
  resetNodeLists({commit}) {
    commit('resetNodeLists');
  },
  resetFilterLists({commit}) {
    commit('resetFilters');
  }
}

const mutations = {
  nodeLists (state, [nodeItem, routeName]) {
    let {resourceNodeList, subjectNodeList, domainNodeList} = state.nodeList

    // When any of the Resource Node is selected
    if ((routeName === "DatabaseView") || (routeName === "StandardsView") || (routeName === "PoliciesView")) {
      const isFound = isNodePresent(resourceNodeList, nodeItem)
      if(!isFound) {
        if (Object.keys(nodeItem).length) {
          resourceNodeList.push(nodeItem)
          state.nodeFound["isResourceNode"] = false
        }
        else {
          state.nodeFound["isResourceNode"] = true
        }
      }
      else {
        state.nodeFound["isResourceNode"] = true
      }
    }

    //When user lands on refine page after selecting a card from home page
    if (routeName === "RefineResourceView") {
      resourceNodeList.length = 0
      resourceNodeList.push(nodeItem)
    }

    // When Subject Node is selected
    if (routeName === "SubjectTypeView") {
      const isFound = isNodePresent(subjectNodeList, nodeItem)
      if(!isFound) {
        if (Object.keys(nodeItem).length) {
          subjectNodeList.push(nodeItem)
          state.nodeFound["isSubjectNode"] = false
        }
        else {
          state.nodeFound["isSubjectNode"] = true
        }
      }
      else {
        state.nodeFound["isSubjectNode"] = true
      }
    }

    // When Domain Node is selected
    if (routeName === "DomainTypeView") {
      const isFound = isNodePresent(domainNodeList, nodeItem)
      if(!isFound) {
        if (Object.keys(nodeItem).length) {
          domainNodeList.push(nodeItem)
          state.nodeFound["isDomainNode"] = false
        }
        else {
          state.nodeFound["isDomainNode"] = true
        }
      }
      else {
        state.nodeFound["isDomainNode"] = true
      }
    }
  },

  filterLists (state, noNullFilters){
    state.filters.filtersList = noNullFilters

    if(state.filters.filtersList && state.filters.filtersList.length) state.filters.isFilter = true
    else state.filters.isFilter = false
  },

  deleteNode(state, nodeItem) {
    let {resourceNodeList, subjectNodeList, domainNodeList} = state.nodeList
    const {type} = nodeItem

    // For resource node is selected
    if ((type === "resource") || (type === "resourceParent")) {
      deleteNode(resourceNodeList, nodeItem)
    }
    // For subject node is selected
    else if (type === "subject") {
      deleteNode(subjectNodeList, nodeItem)
    }
    // For domain node is selected
    else if (type === "domain") {
      deleteNode(domainNodeList, nodeItem)
    }
   
  },
  resetNodeLists(state) {
    state.nodeList = {
      resourceNodeList: [],
      subjectNodeList: [],
      domainNodeList: []
    }
  },

  resetNodeFound(state) {
    state.nodeFound = {
      isResourceNode: false,
      isSubjectNode: false,
      isDomainNode: false,
    }
  },

  resetFilters(state) {
    state.filters = {
      filtersList: [],
      isFilter: false,
    }
  },

};

const getters = {
  getNodeList(state)  {
    return state.nodeList;
  },
  getNodeFound(state)  {
    return state.nodeFound;
  },
  getFilterLists(state)  {
    return state.filters;
  },
}
const nodeListStore = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  isNodePresent,
  deleteNode
}

export default nodeListStore