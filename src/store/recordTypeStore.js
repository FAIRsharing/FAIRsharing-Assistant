import GraphClient from "@/lib/GraphClient/GraphClient.js";
import allRecordsTypes from "@/lib/GraphClient/queries/resource/allRecordsTypes.json";

const CLIENT = new GraphClient()

const state = {
  recordTypes: [],
  allRecordTypes: [],
  error: false,
  loadingData: false,
}

const actions = {
  async fetchAllRecordTypes({commit}) {
    commit("setLoadingData", true)
    let response = await CLIENT.executeQuery(allRecordsTypes);
    commit("setAllRecordTypes", response['recordTypes'])
    commit("setLoadingData", false)
  },
  resetRecords({commit}) {
    commit('resetAllRecordTypes');
  }
}

const mutations = {
  setAllRecordTypes(state, allRecordTypes) { state.allRecordTypes = allRecordTypes },
  setLoadingData(state, loadingData) { state.loadingData = loadingData},
  resetAllRecordTypes(state) {state.allRecordTypes = []},
}
const recordTypeStore = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default recordTypeStore
