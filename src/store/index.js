import Vue from "vue"
import Vuex from "vuex"
import multiTagsStore from "./multiTagsStore"
import navigationStore from "@/store/navigationStore";

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules: {
    multiTagsStore,
    navigationStore
  }
})

