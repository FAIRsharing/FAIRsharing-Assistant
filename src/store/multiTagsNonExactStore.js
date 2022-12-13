import GraphClient from "@/lib/GraphClient/GraphClient.js";
import multiTagsNonExactFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsNonExactFilter.json";

const CLIENT = new GraphClient(),
  MULTI_TAGS = JSON.parse(JSON.stringify(multiTagsNonExactFilter))

export const state = {
    fairSharingRecords:[],
    error: false,
    loadingStatus: false,
}

export const actions = {
    async fetchNonExactMultiTagsTerms({commit}, [resource, subject, domain]) {
        commit("setLoadingStatus", true)
        MULTI_TAGS.queryParam = {
            recordType: resource,
            subjects: subject,
            domains: domain
        }
        //Delete the null/empty parameter
        for (const key in MULTI_TAGS.queryParam) {
            if (MULTI_TAGS.queryParam[key] === null || MULTI_TAGS.queryParam[key] === '') {
                delete MULTI_TAGS.queryParam[key];
            }
        }
        let response = await CLIENT.executeQuery(MULTI_TAGS);
        commit("setFairSharingRecords", response['multiTagFilter'])
        commit("setLoadingStatus", false)
    },
    resetNonExactMultiTags({commit}) {
        commit('resetFairSharingRecords');
    }
}

export const mutations = {
    setFairSharingRecords(state, fairSharingRecords) { state.fairSharingRecords = fairSharingRecords },
    setLoadingStatus(state, loadingStatus) { state.loadingStatus = loadingStatus},
    resetFairSharingRecords(state) {state.fairSharingRecords = []},
}
const multiTagsNonExactStore = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default multiTagsNonExactStore
