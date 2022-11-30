import GraphClient from "@/lib/GraphClient/GraphClient.js";
import topDomains from "@/lib/GraphClient/queries/domain/topDomains.json";

const CLIENT = new GraphClient(),
  TOP_DOMAINS = JSON.parse(JSON.stringify(topDomains))

export const state = {
    domainsType: [],
    error: false,
    loadingData: false,
}

export const actions = {
    async fetchTopDomainTerms({commit}, resource) {
        commit("setLoadingData", true)
        TOP_DOMAINS.queryParam= {
            types: resource
        }
        let response = await CLIENT.executeQuery(TOP_DOMAINS);
        commit("setTopDomainsBubbleTree", response['topDomains'].data)
        commit("setLoadingData", false)
    },
}

export const mutations = {
    setTopDomainsBubbleTree(state, domainsType) { state.domainsType = domainsType },
    setLoadingData(state, loadingData) { state.loadingData = loadingData},
}
const topDomainsStore = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default topDomainsStore
