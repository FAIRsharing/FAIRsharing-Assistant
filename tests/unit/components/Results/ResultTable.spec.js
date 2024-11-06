import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach } from 'vitest'
import ResultTable from "@/components/Results/ResultTable.vue";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();
multiTagsStore.getters = {
  getFairSharingRecords: () => {
    return [
      {
        record: "Wibble",
        registry: "Standard",
        id: 123,
      }
    ]
  },
  getCurrentRegistry: () => { return "database" }
}

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("ResultTable.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ResultTable, {
      global:{
        plugins: [vuetify, store],
        stubs: ['router-link', 'router-view']
      },
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ResultTable");
  });

});
