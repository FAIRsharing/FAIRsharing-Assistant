import GraphClient from "@/lib/GraphClient/GraphClient.js";
import topSubjects from "@/lib/GraphClient/queries/subject/topSubjects.json";

const CLIENT = new GraphClient(),
  TOP_SUBJECTS = JSON.parse(JSON.stringify(topSubjects))

export const state = {
  topSubjectBubbleTree: [],
  error: false,
  loadingData: false,
}

export const actions = {
  async fetchTopSubjectTerms({commit}, resource) {
    commit("setLoadingData", true)
    TOP_SUBJECTS.queryParam= {
      types: resource
    }
    let response = await CLIENT.executeQuery(TOP_SUBJECTS);
    commit("setTopSubjectBubbleTree", response['topSubjects'].data)
    commit("setLoadingData", false)
  },
}

export const mutations = {
  setTopSubjectBubbleTree(state, topSubjectBubbleTree) { state.topSubjectBubbleTree = topSubjectBubbleTree },
  setLoadingData(state, loadingData) { state.loadingData = loadingData},
}
const topSubjectStore = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default topSubjectStore
