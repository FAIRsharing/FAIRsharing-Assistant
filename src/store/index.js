import Vue from "vue"
import Vuex from "vuex"
import browseSubjectsStore from "./browseSubjectsStore"
import topSubjectStore from "./topSubjectStore"
import bubbleSelectedStore from './bubbleSelectedStore'
import recordTypeStore from './recordTypeStore'
import topDomainsStore from "./topDomainsStore"
import multiTagsStore from "./multiTagsStore"
import variableTagStore from "./variableTagStore";


Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules: {
    browseSubjectsStore,
    topSubjectStore,
    bubbleSelectedStore,
    recordTypeStore,
    topDomainsStore,
    multiTagsStore,
    variableTagStore,
  }
})

