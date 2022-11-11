import GraphClient from "@/lib/GraphClient/GraphClient.js";
import recordType from "@/lib/GraphClient/queries/resource/recordType.json";

const CLIENT = new GraphClient(),
  RECORD_TYPE = JSON.parse(JSON.stringify(recordType))

export const state = {
    recordTypes: [],
    error: false,
    loadingData: false,
}

export const actions = {

    async fetchRecordTypes({commit}, id) {
        commit("setLoadingData", true)
        RECORD_TYPE.queryParam= {
            id: id
        }
        let response = await CLIENT.executeQuery(RECORD_TYPE);
        commit("setRecordTypes", response['recordType'])
        commit("setLoadingData", false)
    },
}

export const mutations = {
    setRecordTypes(state, recordTypes) { state.recordTypes = recordTypes },
    setLoadingData(state, loadingData) { state.loadingData = loadingData},
}
const recordTypeStore = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default recordTypeStore
