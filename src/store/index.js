import Vue from "vue"
import Vuex from "vuex"
import browseSubjectsStore from "./browseSubjectsStore"
import bubbleSelectedStore from './bubbleSelectedStore'
import recordTypeStore from './recordTypeStore'
import multiTagsStore from "./multiTagsStore"
import variableTagStore from "./variableTagStore";
import addOnFilterSelectedStore from "./addOnFilterSelectedStore.js"
import otherResourcesSelectedStore from "./otherResourcesSelectedStore"
import breadCrumbStore from "@/store/breadCrumbStore";


Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules: {
    browseSubjectsStore,
    bubbleSelectedStore,
    recordTypeStore,
    multiTagsStore,
    variableTagStore,
    addOnFilterSelectedStore,
    otherResourcesSelectedStore,
    breadCrumbStore
  }
})

