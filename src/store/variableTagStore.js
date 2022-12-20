import GraphClient from "@/lib/GraphClient/GraphClient.js";
import variableFilter from "@/lib/GraphClient/queries/variableFilter/variableFilter.json";

const CLIENT = new GraphClient(),
  MULTI_TAGS = JSON.parse(JSON.stringify(variableFilter))

export const state = {
  variableResponse: [],
  error: false,
  loadingStatus: false,
}

export const actions = {
  async fetchVariableTags({commit}, [resource, subject, domain, tag]) {
    commit("setLoadingStatus", true)
    MULTI_TAGS.queryParam = {
      recordType: resource,
      subjects: subject,
      domains: domain,
      groupBy: tag
    }
    //Delete the null/empty parameter
    for (const key in MULTI_TAGS.queryParam) {
      if (MULTI_TAGS.queryParam[key] === null || MULTI_TAGS.queryParam[key] === '') {
        delete MULTI_TAGS.queryParam[key];
      }
    }
    console.log("MULTI_TAGS.queryParam::", MULTI_TAGS.queryParam)
    let response = await CLIENT.executeQuery(MULTI_TAGS);
    commit("setVariableResponse", response['variableFilter'].data)
    commit("setLoadingStatus", false)
  },
  resetVariableTags({commit}) {
    commit('resetVariableResponse');
  }
}

export const mutations = {
  setVariableResponse(state, variableResponse) { state.variableResponse = variableResponse },
  setLoadingStatus(state, loadingStatus) { state.loadingStatus = loadingStatus},
  resetVariableResponse(state) {state.variableResponse = []}
}
const variableTagStore = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default variableTagStore
