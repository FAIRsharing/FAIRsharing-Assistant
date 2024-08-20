import { createStore } from 'vuex'
import multiTagsStore from "./multiTagsStore"
import navigationStore from "@/store/navigationStore";

// Create a new store instance.
const store = createStore({
  namespaced: true,
  modules: {
    multiTagsStore,
    navigationStore
  }
})

export default store