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
    // eslint-disable-next-line no-console
    console.log("addonfilters::", addonfilters)
    commit("setLoadingStatus", true)
    VARIABLE_TAGS.queryParam = {
      recordType: resource,
      subjects: subject,
      domains: domain,
      groupBy: tag,
      status: addonfilters.get("status") ? addonfilters.get("status") : null,
      hasPublication: addonfilters.get("hasPublication")? JSON.parse(addonfilters.get("hasPublication")): false,
      isRecommended: addonfilters.get("isRecommended")? JSON.parse(addonfilters.get("isRecommended")): false,
      isImplemented: addonfilters.get("isImplemented")? JSON.parse(addonfilters.get("isImplemented")): false,
      usesPersistentIdentifier: addonfilters.get("usesPersistentIdentifier")? JSON.parse(addonfilters.get("usesPersistentIdentifier")): false,
      dataPreservationPolicy: addonfilters.get("dataPreservationPolicy")? JSON.parse(addonfilters.get("dataPreservationPolicy")): false,
      resourceSustainability: addonfilters.get("resourceSustainability")? JSON.parse(addonfilters.get("resourceSustainability")): false,
      dataAccessCondition: addonfilters.get("dataAccessCondition")? addonfilters.get("dataAccessCondition"): null,
      dataCuration: addonfilters.get("dataCuration")? addonfilters.get("dataCuration"): null,
      dataDepositionCondition: addonfilters.get("dataDepositionCondition")? addonfilters.get("dataDepositionCondition"): null,
      citationToRelatedPublications: addonfilters.get("citationToRelatedPublications")? addonfilters.get("citationToRelatedPublications"): null,
      dataAccessForPrePublicationReview: addonfilters.get("dataAccessForPrePublicationReview")? addonfilters.get("dataAccessForPrePublicationReview"): null,
      dataContactInformation: addonfilters.get("dataContactInformation")? addonfilters.get("dataContactInformation"): null,
      dataVersioning: addonfilters.get("dataVersioning")? addonfilters.get("dataVersioning"): null
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
