import GraphClient from "@/lib/GraphClient/GraphClient.js";
import multiTagsNonExactFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";

const CLIENT = new GraphClient(),
  MULTI_TAGS = JSON.parse(JSON.stringify(multiTagsNonExactFilter))

const state = {
  queryParams: {},
  fairSharingRecords: [],
  error: false,
  loadingStatus: false,
  refinedStatus: false,
  currentRegistry: '',
  seletedTags: []
}

const actions = {
  async fetchMultiTagsTerms({commit}, [resource, subject, domain]) {
    commit("setLoadingStatus", true)
    MULTI_TAGS.queryParam = {
      recordType: resource,
      subjects: subject,
      domains: domain
    }
    //Delete the null/empty parameter
    for (const key in MULTI_TAGS.queryParam) {
      if (MULTI_TAGS.queryParam[key] === null || MULTI_TAGS.queryParam[key] === "null" || MULTI_TAGS.queryParam[key] === '' || MULTI_TAGS.queryParam[key].length === 0) {
        delete MULTI_TAGS.queryParam[key];
      }
    }
    // eslint-disable-next-line no-console
    // console.log("MULTI_TAGS.queryParam::", MULTI_TAGS.queryParam)
    let response = await CLIENT.executeQuery(MULTI_TAGS);
    commit("setFairSharingRecords", response['multiTagFilter'])
    commit("setLoadingStatus", false)
  },
  resetMultiTags({commit}) {
    commit('resetFairSharingRecords');
  },

  // TODO: This query is a duplicate of the above fetch method. The one above can be deleted if the components
  // TODO: that use it are also discarded in favour of the parts added rapidly at the beginning of July 2023.
  async fetchMultiTagData({commit}, queryParams) {
    commit("setLoadingStatus", true);
    MULTI_TAGS.queryParam = queryParams;
    let response = await CLIENT.executeQuery(MULTI_TAGS);
    commit("setFairSharingRecords", response['multiTagFilter']);
    //commit("setQueryParams", queryParams); // appears to cause horrid recursive vuex errors...
    commit("setLoadingStatus", false);
  }
}



const mutations = {
  setFairSharingRecords(state, fairSharingRecords) { state.fairSharingRecords = fairSharingRecords },
  setLoadingStatus(state, loadingStatus) { state.loadingStatus = loadingStatus },
  resetFairSharingRecords(state) {state.fairSharingRecords = []},
  setQueryParams(state, params) { state.queryParams = params },
  setRefinedStatus(state, refinedStatus) { state.refinedStatus = refinedStatus },
  setCurrentRegistry(state, currentRegistry) { state.currentRegistry = currentRegistry },
  setSelectedTags(state, selectedTags) { state.seletedTags = selectedTags }
}

const getters = {
  getFairSharingRecords(state)  {
    return state.fairSharingRecords;
  },
  getQueryParams(state) {
    return state.queryParams;
  },
  getLoadingStatus(state) {
    return state.getLoadingStatus;
  },
  getRefinedStatus(state) {
    return state.refinedStatus
  },
  getCurrentRegistry(state) {
    return state.currentRegistry
  },
  getSelectedTags(state) {
    return state.seletedTags
  }
}
const multiTagsStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

export default multiTagsStore
