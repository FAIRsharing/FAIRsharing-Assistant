import Vue from "vue"
import Vuex from "vuex"
import subjectStore from "./subjectStore"
import topSubjectStore from "./topSubjectStore"
import bubbleSelectedStore from './bubbleSelectedStore'
import recordTypeStore from './recordTypeStore'
import otherSubjectsStore from './otherSubjectsStore'


Vue.use(Vuex);

export default new Vuex.Store({
    namespaced: true,
    modules: {
        subjectStore,
        topSubjectStore,
        otherSubjectsStore,
        bubbleSelectedStore,
        recordTypeStore,
    }
})

