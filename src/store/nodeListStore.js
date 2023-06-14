const state = {
  nodeList: {
    resourceNodeList: [],
    subjectNodeList: [],
    domainNodeList: []
  },
  nodeFound: {
    isResourceNode: false,
    isSubjectNode: false,
    isDomainNode: false,
  }
};
/**
 *
 * @param recordArray - array of records
 * @param nodeItem - Object of a record
 * @returns {boolean}
 */
const isNodePresent = (recordArray, nodeItem) => {
  return recordArray.find(({records}) => records === nodeItem["records"])
}

/**
 *
 * @param recordArray - array of records
 * @param nodeItem - Object of a record
 */
const deleteNode = (recordArray, nodeItem) => {
  recordArray.splice(recordArray.indexOf(nodeItem), 1)
}

const actions = {
  resetNodeLists({commit}) {
    commit('resetNodeLists');
  }
}

const mutations = {
  nodeLists (state, [nodeItem, routeName]) {
    let {resourceNodeList, subjectNodeList, domainNodeList} = state.nodeList

    // When any of the Resource Node is selected
    if ((routeName === "DatabaseView") || (routeName === "StandardsView") || (routeName === "PoliciesView")) {
      const isFound = isNodePresent(resourceNodeList, nodeItem)
      if(!isFound) {
        resourceNodeList.push(nodeItem)
        state.nodeFound["isResourceNode"] = false
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
        subjectNodeList.push(nodeItem)
        state.nodeFound["isSubjectNode"] = false
      }
      else {
        state.nodeFound["isSubjectNode"] = true
      }
    }

    // When Domain Node is selected
    if (routeName === "DomainTypeView") {
      const isFound = isNodePresent(domainNodeList, nodeItem)
      if(!isFound) {
        domainNodeList.push(nodeItem)
        state.nodeFound["isDomainNode"] = false
      }
      else {
        state.nodeFound["isDomainNode"] = true
      }
    }


  },
  deleteNode(state, nodeItem) {
    let {resourceNodeList, subjectNodeList, domainNodeList} = state.nodeList
    const {type} = nodeItem

    // For Resource Node is selected
    if ((type === "resource") || (type === "resourceParent")) {
      deleteNode(resourceNodeList, nodeItem)
    }
    else if (type === "subject") {
      deleteNode(subjectNodeList, nodeItem)
    }
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

};

const getters = {
  getNodeList(state)  {
    return state.nodeList;
  },
  getNodeFound(state)  {
    return state.nodeFound;
  }
}
const nodeListStore = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default nodeListStore