import GraphClient from "@/lib/GraphClient/GraphClient.js";
import recordType from "@/lib/GraphClient/queries/resource/recordType.json";
import allRecordsTypes from "@/lib/GraphClient/queries/resource/allRecordsTypes.json";

const CLIENT = new GraphClient(),
  RECORD_TYPE = JSON.parse(JSON.stringify(recordType))

export const state = {
    recordTypes: [],
    allRecordTypes: [],
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
    async fetchAllRecordTypes({commit}) {
        commit("setLoadingData", true)
        let response = await CLIENT.executeQuery(allRecordsTypes);
        commit("setAllRecordTypes", response['recordTypes'])
        commit("setLoadingData", false)
    },
}

export const mutations = {
    setRecordTypes(state, recordTypes) { state.recordTypes = recordTypes },
    setAllRecordTypes(state, allRecordTypes) { state.allRecordTypes = allRecordTypes },
    setLoadingData(state, loadingData) { state.loadingData = loadingData},
}
const recordTypeStore = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default recordTypeStore
