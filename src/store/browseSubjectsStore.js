import GraphClient from "@/lib/GraphClient/GraphClient.js";
import subjectSummary from "@/lib/GraphClient/queries/subject/subjectSummary.json";

const CLIENT = new GraphClient()
export const state = {
  subjectBubbleTree: [],
  error: false,
  loadingData: false,
}

export const actions = {
  async fetchTerms({commit}) {
    commit("setLoadingData", true)
    let response = await CLIENT.executeQuery(subjectSummary)
    commit("setSubjectBubbleTree", response['subjectSummary'].data)
    commit("setLoadingData", false)
  },
  leavePage({commit}) {
    commit('resetSubjectBubbleTree');
  }
}

export const mutations = {
  setSubjectBubbleTree(state, subjectBubbleTree) { state.subjectBubbleTree = subjectBubbleTree },
  setLoadingData(state, loading) { state.loadingData = loading},
  resetSubjectBubbleTree(state) {state.subjectBubbleTree = []},
}
const browseSubjectsStore = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default browseSubjectsStore
