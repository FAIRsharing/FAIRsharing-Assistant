const state = {
    resourceType: ''
};

const mutations = {
    resourceSelected (state, resource) {
        state.resourceType = resource
    },
    subjectSelected (state, subject) {
        state.subjectType = subject
    }
};

const getters = {
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