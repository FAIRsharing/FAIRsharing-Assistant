import Vue from "vue"
import Vuex from "vuex"
import multiTagsStore from "./multiTagsStore"
import addOnFilterSelectedStore from "./addOnFilterSelectedStore.js"
import nodeListStore from "@/store/nodeListStore"


Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules: {
    multiTagsStore,
    addOnFilterSelectedStore,
    nodeListStore
  }
})

