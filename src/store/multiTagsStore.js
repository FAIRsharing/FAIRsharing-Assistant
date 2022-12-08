import GraphClient from "@/lib/GraphClient/GraphClient.js";
import multiTagsFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";

const CLIENT = new GraphClient(),
  MULTI_TAGS = JSON.parse(JSON.stringify(multiTagsFilter))

export const state = {
    result:[],
    registry:"",
    type:"",
    subjects: [],
    domains: [],
    error: false,
    loadingStatus: false,
}

export const actions = {
    async fetchMultiTagsTerms({commit}, [resource, subject, domain]) {
        commit("setLoadingStatus", true)
        MULTI_TAGS.queryParam = {
            recordType: resource,
            subjectsExact: subject,
            domainsExact: domain
        }
        //Delete the null/empty parameter
        for (const key in MULTI_TAGS.queryParam) {
            if (MULTI_TAGS.queryParam[key] === null || MULTI_TAGS.queryParam[key] === '') {
                delete MULTI_TAGS.queryParam[key];
            }
        }
        let response = await CLIENT.executeQuery(MULTI_TAGS);
        commit("setResult", response['multiTagFilter'])

        this.subjects = response['multiTagFilter'].map(({subjects}) => subjects)
        commit("setSubjects", this.subjects)

        this.domains = response['multiTagFilter'].map(({domains}) => domains)

        commit("setDomains", this.domains)
        commit("setLoadingStatus", false)
    },
}

export const mutations = {
    setResult(state, result) { state.result = result },
    setSubjects(state, subjects) { state.subjects = subjects },
    setDomains(state, domains) { state.domains = domains },
    setLoadingStatus(state, loadingStatus) { state.loadingStatus = loadingStatus},
}
const multiTagsStore = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default multiTagsStore
