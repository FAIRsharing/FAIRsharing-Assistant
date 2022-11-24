const state = {
    topResourceType:'',
    resourceType: '',
    subjectType: {}
};

const mutations = {
    resourceSelected (state, resource) {
        state.topResourceType = resource["topResourceSelected"]
        state.resourceType = resource["childResourceSelected"]
    },
    subjectSelected (state, subject) {
        state.subjectType = subject
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
    }
}
const bubbleSelectedStore = {
    namespaced: true,
    state,
    getters,
    mutations,
}

export default bubbleSelectedStore