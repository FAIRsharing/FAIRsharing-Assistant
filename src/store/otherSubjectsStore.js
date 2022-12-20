import GraphClient from "@/lib/GraphClient/GraphClient.js";
import otherSubjects from "@/lib/GraphClient/queries/subject/otherSubjects.json";

const CLIENT = new GraphClient(),
  OTHER_SUBJECTS = JSON.parse(JSON.stringify(otherSubjects))


export const state = {
  otherSubjectBubble: [],
  error: false,
  loadingStatus: false,
}


export const mutations = {
  setOtherSubjectBubble(state, otherSubjectBubble) { state.otherSubjectBubble = otherSubjectBubble },
  loadingStatus(state, newLoadingStatus) { state.loadingStatus = newLoadingStatus},
}

export const actions = {
  //change arg as ids instead of id
  async fetchOtherSubject({commit}, [subjectId, resource]) {

    OTHER_SUBJECTS.queryParam= {
      //ids: ids
      ids: subjectId,
      types: resource
    }
    commit("loadingStatus", true)
    let response = await CLIENT.executeQuery(OTHER_SUBJECTS);
    commit("setOtherSubjectBubble", response['otherSubjects'].data)
    commit("loadingStatus", false)
  },
}

export const getters = {
  loadingStatus(state) {
    return state.loadingStatus
  }
}
const otherSubjectsStore = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}

export default otherSubjectsStore
