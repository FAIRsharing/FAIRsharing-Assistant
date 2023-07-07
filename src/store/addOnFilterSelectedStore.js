import isFilterPresent from "@/utils/Others/isFilterPresent"

import deleteNode from "@/utils/Others/deleteNode"

const state = {
  filtersType: [],
};

const actions = {
  resetFiltersSelected({commit}) {
    commit('resetFiltersSelected');
  }
}

const mutations = {
  filtersSelected (state, filters) {
    const isFound = isFilterPresent(state.filtersType, filters)

    if(!isFound) {
      state.filtersType.push(filters)
    }
    else {
      state.filtersType.forEach(item => {
        if (item["key"] === filters["key"]) {
          if(filters["value"] && filters["value"].length) {
            item["value"] = filters["value"]
          }
          else {
            deleteNode(state.filtersType, item)
          }
        }
      })
    }
  },
  resetFiltersSelected (state) {
    state.filtersType = []
  }

};

const getters = {
  getFilters(state)  {
    return state.filtersType;
  },
}
const addOnFilterSelectedStore = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default addOnFilterSelectedStore