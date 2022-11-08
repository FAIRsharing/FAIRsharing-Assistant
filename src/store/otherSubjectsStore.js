import GraphClient from "@/lib/GraphClient/GraphClient.js";
import otherSubjects from "@/lib/GraphClient/queries/subject/otherSubjects.json";

const CLIENT = new GraphClient(),
  OTHER_SUBJECTS = JSON.parse(JSON.stringify(otherSubjects))


export const state = {
    otherSubjectBubble: [],
    error: false,
    loadingData: false,
}

export const actions = {
    async fetchOtherSubject({commit}, [subjectId, resource]) {
        commit("setLoadingData", true)
        OTHER_SUBJECTS.queryParam= {
            ids: subjectId,
            types: resource
        }
        let response = await CLIENT.executeQuery(OTHER_SUBJECTS);
        commit("setOtherSubjectBubble", response['otherSubjects'].data)
        commit("setLoadingData", false)
    },
}

export const mutations = {
    setOtherSubjectBubble(state, otherSubjectBubble) { state.otherSubjectBubble = otherSubjectBubble },
    setLoadingData(state, loadingData) { state.loadingData = loadingData},
}
const otherSubjectsStore = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default otherSubjectsStore
