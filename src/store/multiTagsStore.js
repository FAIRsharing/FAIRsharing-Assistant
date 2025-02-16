import GraphClient from "@/lib/GraphClient/GraphClient.js";
import multiTagsNonExactFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";

const CLIENT = new GraphClient(),
  MULTI_TAGS = JSON.parse(JSON.stringify(multiTagsNonExactFilter));

const state = {
  queryParams: {},
  fairSharingRecords: [],
  error: false,
  loadingStatus: false,
  refinedStatus: false,
  selectedTags: [],
  selectionMessage: "",
};

const actions = {
  resetMultiTags({ commit }) {
    commit("resetMultiTagsRecords");
  },

  // TODO: This query is a duplicate of the above fetch method. The one above can be deleted if the components
  // TODO: that use it are also discarded in favour of the parts added rapidly at the beginning of July 2023.
  async fetchMultiTagData({ commit }, queryParams) {
    commit("setLoadingStatus", true);
    MULTI_TAGS.queryParam = queryParams;
    let response = await CLIENT.executeQuery(MULTI_TAGS);
    commit("setFairSharingRecords", response["multiTagFilter"] || []);
    //commit("setQueryParams", queryParams); // appears to cause horrid recursive vuex errors...
    commit("setLoadingStatus", false);
  },
};

const mutations = {
  setFairSharingRecords(state, fairSharingRecords) {
    state.fairSharingRecords = fairSharingRecords;
  },
  setLoadingStatus(state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  resetMultiTagsRecords(state) {
    (state.queryParams = {}),
      (state.fairSharingRecords = []),
      (state.error = false),
      (state.loadingStatus = false),
      (state.refinedStatus = false),
      (state.selectedTags = []),
      (state.selectionMessage = "");
  },
  setQueryParams(state, params) {
    state.queryParams = params;
  },
  setRefinedStatus(state, refinedStatus) {
    state.refinedStatus = refinedStatus;
  },
  setSelectedTags(state, selectedTags) {
    state.selectedTags = selectedTags;
  },
  setError(state, error) {
    state.error = error;
  },
  setSelectionMessage(state, selectionMessage) {
    state.selectionMessage = selectionMessage;
  },
};

const getters = {
  getFairSharingRecords(state) {
    return state.fairSharingRecords;
  },
  getQueryParams(state) {
    return state.queryParams;
  },
  getLoadingStatus(state) {
    return state.loadingStatus;
  },
  getRefinedStatus(state) {
    return state.refinedStatus;
  },
  getCurrentRegistry(state) {
    try {
      if (state.queryParams["fairsharingRegistry"].length > 0) {
        return state.queryParams["fairsharingRegistry"][0];
      } else {
        return null;
      }
    } catch {
      return null;
    }
  },
  getSelectedTags(state) {
    return state.selectedTags;
  },
  getError(state) {
    return state.error;
  },
  getSelectionMessage(state) {
    return state.selectionMessage;
  },
};
const multiTagsStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default multiTagsStore;
