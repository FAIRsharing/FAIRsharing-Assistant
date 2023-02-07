import GraphClient from "@/lib/GraphClient/GraphClient.js";
import variableFilter from "@/lib/GraphClient/queries/variableFilter/variableFilter.json";

const CLIENT = new GraphClient(),
  VARIABLE_TAGS = JSON.parse(JSON.stringify(variableFilter))

export const state = {
  variableResponse: [],
  error: false,
  loadingStatus: false,
}

export const actions = {
  async fetchVariableTags({commit}, [resource, subject, domain, tag, dataPreservationPolicy]) {
    commit("setLoadingStatus", true)
    VARIABLE_TAGS.queryParam = {
      recordType: resource,
      subjects: subject,
      domains: domain,
      groupBy: tag,
      dataPreservationPolicy: dataPreservationPolicy
    }
    //Delete the null/empty parameter
    for (const key in VARIABLE_TAGS.queryParam) {
      if (VARIABLE_TAGS.queryParam[key] === null || VARIABLE_TAGS.queryParam[key] === '' || VARIABLE_TAGS.queryParam[key] === undefined) {
        delete VARIABLE_TAGS.queryParam[key];
      }
    }
    // eslint-disable-next-line no-console
    console.log("VARIABLE_TAGS.queryParam::", VARIABLE_TAGS.queryParam)
    let response = await CLIENT.executeQuery(VARIABLE_TAGS);
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
