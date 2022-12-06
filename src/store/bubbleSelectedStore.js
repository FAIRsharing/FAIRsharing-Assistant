const state = {
    topResourceType:'',
    resourceType: '',
    subjectType: {},
    domainType: ''
};

const mutations = {
    resourceSelected (state, resource) {
        state.topResourceType = resource["topResourceSelected"]
        state.resourceType = resource["childResourceSelected"]
    },
    subjectSelected (state, subject) {
        state.subjectType = subject
    },
    domainSelected (state, domain) {
        state.domainType = domain
    }
};

const getters = {
    getTopResource(state)  {
        return state.topResourceType;
    },
    getResource(state)  {
        return state.resourceType;
    },
    getSubject(state)  {
        return state.subjectType;
    },
    getDomain(state)  {
        // console.log("state::", state)
        // return "peptide library";
        return state.domainType;
    },
}
const bubbleSelectedStore = {
    namespaced: true,
    state,
    getters,
    mutations,
}

export default bubbleSelectedStore