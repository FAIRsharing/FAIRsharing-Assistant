import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import RefineSelection from "@/components/RefineSelection/RefineSelection.vue";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();
const mockRouter = { push: vi.fn() };

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
  getQueryParams:  () => {
    return {
      fairsharingRegistry: ['genetics'],
    }
  },
  getCurrentRegistry: () => { return "" }
}
multiTagsStore.state = {
  refinedStatus: false
}
multiTagsStore.commit = vi.fn()

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("RefineSelection.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineSelection, {
      global:{
        data(){
          return {
            recordTypes: {},
            help: false,
            helpText: {
              tags: ["abc"],
              refinement: ["nv"]
            }
          }
        },
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
        },
        stubs: ['router-link', 'router-view']

      },
    })
    wrapper.vm.showHelp()
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineSelection");
  });

  it("can recordsAvailable computed method when there are no getFairSharingRecords", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return []
      },
      getCurrentRegistry: () => { return "" }
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      }
    })

    wrapper = shallowMount(RefineSelection, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
        },

      },
    })
    expect(wrapper.vm.recordsAvailable).toBe(0);
    expect(wrapper.vm.capitaliseText('genetics', null)).toBe("Genetics");
  });

  it("can recordsAvailable computed method when there are getFairSharingRecords", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [ {
          record: "Wibble",
          registry: "Policy",
          id: 123,
        }]
      },
      getCurrentRegistry: () => { return "Policy" }
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      }
    })

    wrapper = shallowMount(RefineSelection, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
        },

      },
    })
    expect(wrapper.vm.recordsAvailable).toBe(1);
  });

  it("can showHelp method is called", () => {
    const showHelp = wrapper.get("#showHelp");
    showHelp.trigger('click')
    wrapper.vm.showHelp()
    expect(wrapper.vm.help).toBe(true);
  });

  it("can hideHelp method is called", () => {
    wrapper.vm.hideHelp()
    expect(wrapper.vm.help).toBe(false);
  });
});
