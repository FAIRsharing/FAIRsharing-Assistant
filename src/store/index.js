import Vue from "vue"
import Vuex from "vuex"
import browseSubjectsStore from "./browseSubjectsStore"
import topSubjectStore from "./topSubjectStore"
import bubbleSelectedStore from './bubbleSelectedStore'
import recordTypeStore from './recordTypeStore'
import otherSubjectsStore from './otherSubjectsStore'
import subjectStore from './subjectStore'
import topDomainsStore from "./topDomainsStore"
import multiTagsStore from "./multiTagsStore"
import variableTagStore from "./variableTagStore";


Vue.use(Vuex);

export default new Vuex.Store({
    namespaced: true,
    modules: {
        browseSubjectsStore,
        topSubjectStore,
        otherSubjectsStore,
        bubbleSelectedStore,
        recordTypeStore,
        subjectStore,
        topDomainsStore,
        multiTagsStore,
        variableTagStore
    }
})

