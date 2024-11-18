import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import SwitchFilter from "@/components/Others/SwitchFilter.vue"
import multiTagsStore from "@/store/multiTagsStore";


const vuetify = createVuetify();
const state = {
  queryParams :{
    subjects: ['genetics'],
    dataContactInformation: ['yes'],
    recordType: ['knowledgebase', 'repository', 'knowledgebase_and_repository']
  }
}
    
multiTagsStore.getters = {
  getQueryParams:  () => {
    return state.queryParams
  },
}

multiTagsStore.actions = {
  fetchMultiTagData: vi.fn(),
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("SwitchFilter.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SwitchFilter, {
      global: {
        plugins: [vuetify, store],
        stubs: ['router-link'],
        props: {
          filter:{}
        }
      }
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SwitchFilter");
  });

  it("selectToggle method is called", async () => {
    const filter = {
      "filterName": "Data Contact Information",
      "filterQuery": "dataContactInformation",
      "refineToggle": ["yes"],
      "options": [
        "yes",
        "no",
        "not found"
      ],
      "filterTypes": [
        "database"
      ],
      "tooltip": "Does the repository show data depositor contact information on dataset landing pages?"
    }

    await wrapper.setProps({filter : filter})
    wrapper.vm.hasBeenUsed = true

    //When filtersOpted is true
    wrapper.vm.filtersOpted = "true"
    wrapper.vm.selectToggle(wrapper.props().filter)
    expect(wrapper.vm.getQueryParams).toStrictEqual(state.queryParams)

    //When filtersOpted is false
    wrapper.vm.filtersOpted = "false"
    wrapper.vm.selectToggle(wrapper.props().filter)
    expect(wrapper.vm.getQueryParams).toStrictEqual(state.queryParams)

    //When filtersOpted default value null
    wrapper.vm.filtersOpted = null
    wrapper.vm.selectToggle(wrapper.props().filter)
    expect(wrapper.vm.getQueryParams).toStrictEqual(state.queryParams)
  });

  it("preSelectedFilter method is called", async () => {
    const filter = {
      "filterName": "Data Contact Information",
      "filterQuery": "dataContactInformation",
      "refineToggle": ["yes"],
      "options": [
        "yes",
        "no",
        "not found"
      ],
      "filterTypes": [
        "database"
      ],
      "tooltip": "Does the repository show data depositor contact information on dataset landing pages?"
    }

    await wrapper.setProps({filter : filter})
    wrapper.vm.preSelectedFilter()
    expect(wrapper.vm.filtersOpted).toBe("null");

  });
});
