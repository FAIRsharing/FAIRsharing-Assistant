import GraphClient from "@/lib/GraphClient/GraphClient.js";
import variableFilter from "@/lib/GraphClient/queries/variableFilter/variableFilter.json";

const CLIENT = new GraphClient(),
  VARIABLE_TAGS = JSON.parse(JSON.stringify(variableFilter))

export const state = {
  variableResponse: [],
  error: false,
  loadingStatus: false,
}

// let filterStatus = false

export const actions = {
  async fetchVariableTags({commit}, [resource, subject, domain, tag, addonfilters]) {
    console.log("addonfilters::", addonfilters)

    commit("setLoadingStatus", true)
    VARIABLE_TAGS.queryParam = {
      recordType: resource,
      subjects: subject,
      domains: domain,
      groupBy: tag,
      status: addonfilters.get("status"),
      hasPublication: JSON.parse(addonfilters.get("hasPublication")),
      isRecommended: JSON.parse(addonfilters.get("isRecommended")),
      isImplemented: JSON.parse(addonfilters.get("isImplemented")),
      usesPersistentIdentifier: JSON.parse(addonfilters.get("usesPersistentIdentifier")),
      dataPreservationPolicy: JSON.parse(addonfilters.get("dataPreservationPolicy")),
      resourceSustainability: JSON.parse(addonfilters.get("resourceSustainability")),
      dataAccessCondition: addonfilters.get("dataAccessCondition"),
      dataCuration: addonfilters.get("dataCuration"),
      dataDepositionCondition: addonfilters.get("dataDepositionCondition"),
      citationToRelatedPublications: addonfilters.get("citationToRelatedPublications"),
      dataAccessForPrePublicationReview: addonfilters.get("dataAccessForPrePublicationReview"),
      dataContactInformation: addonfilters.get("dataContactInformation"),
      dataVersioning: addonfilters.get("dataVersioning")
    }
    //Delete the null/empty parameter
    for (const key in VARIABLE_TAGS.queryParam) {
      if (VARIABLE_TAGS.queryParam[key] === null || VARIABLE_TAGS.queryParam[key] === '' || VARIABLE_TAGS.queryParam[key] === undefined || VARIABLE_TAGS.queryParam[key] === false) {
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
