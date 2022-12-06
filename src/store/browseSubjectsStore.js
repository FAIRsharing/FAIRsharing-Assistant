import GraphClient from "@/lib/GraphClient/GraphClient.js";
// import GraphClient from "@/lib/GraphClient/GraphClientProd.js";
// import browseSubjects from "@/lib/GraphClient/queries/subject/browseSubjects.json";
import subjectSummary from "@/lib/GraphClient/queries/subject/subjectSummary.json";


//cache for 2 days i.e. 172,800,000 ms
// const cacheLifeSpan = 2 * 24 * 60 * 60 *1000
const CLIENT = new GraphClient()
export const state = {
    subjectBubbleTree: [],
    error: false,
    loadingData: false,
}

export const actions = {
    async fetchTerms({commit}) {
        commit("setLoadingData", true)
        // let response = null
        // const currentDate = new Date()
        // let dataPostedOn = localStorage.getItem("postedOn");
        // if(!dataPostedOn) {
        //     localStorage.setItem("postedOn", currentDate.toString());
        //     dataPostedOn = new Date(localStorage.getItem("postedOn"))
        //     response = await CLIENT.executeQuery(browseSubjects);
        //     localStorage.setItem("latestSubjectResponse", JSON.stringify(response));
        // } else {
        //     dataPostedOn = new Date(dataPostedOn)
        //     const timeEnlapsed = currentDate.getTime() - dataPostedOn.getTime()
        //     if (timeEnlapsed >= cacheLifeSpan) {
        //         localStorage.setItem("postedOn", currentDate.toString());
        //         response = await CLIENT.executeQuery(browseSubjects);
        //         localStorage.setItem("latestSubjectResponse", JSON.stringify(response));
        //     } else {
        //         response = JSON.parse(localStorage.getItem("latestSubjectResponse"));
        //     }
        // }
        // let response = await CLIENT.executeQuery(browseSubjects)
        // commit("setSubjectBubbleTree", response['browseSubjects'].data)

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
