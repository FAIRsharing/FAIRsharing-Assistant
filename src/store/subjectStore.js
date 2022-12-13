import GraphClient from "@/lib/GraphClient/GraphClient.js";
import subject from "@/lib/GraphClient/queries/subject/subject.json";

const CLIENT = new GraphClient(),
  SUBJECT_TYPE = JSON.parse(JSON.stringify(subject))

export const state = {
    subjectRecords: [],
    error: false,
    loadingData: false,
}

export const actions = {

    async fetchSubjectRecords({commit}, id) {
        commit("setLoadingData", true)
        SUBJECT_TYPE.queryParam= {
            id: id
        }
        let response = await CLIENT.executeQuery(SUBJECT_TYPE);
        commit("setSubjectRecords", response["subject"])
        commit("setLoadingData", false)
    },
    resetSubjects({commit}) {
        commit('resetSubjectRecords');
    }
}

export const mutations = {
    setSubjectRecords(state, subjectRecords) { state.subjectRecords = subjectRecords },
    setLoadingData(state, loadingData) { state.loadingData = loadingData},
    resetSubjectRecords(state) {state.subjectRecords = []},
}
const subjectStore = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default subjectStore
