import {shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import {describe, expect, it, beforeEach, vi} from 'vitest'
import AddOnFilters from "@/components/Others/AddOnFilters.vue"
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();
let mockRoute = {
  path: "/test",
  name: "HomeView",
  params:{
    id: 1
  },
  query:{
    registry: "somestring",
    record_type: "42",
  }
};
let addOnFilters = {
  switch:[
    {
      "filterName": "Mock_Uses persistent identifier",
      "filterQuery": "Mock_usesPersistentIdentifier",
      "refineToggle": false,
      "filterTypes": [
        "Mock_database"
      ],
      "tooltip": "Mock_Does this resource implement any identifier schema standard?"
    },
  ],
  select: [{
    "filterName": "Mock_Life Cycle Status",
    "filterQuery": "Mock_status",
    "refineToggle": [],
    "options": [
      "Mock_ready",
      "Mock_in_development",
      "Mock_deprecated",
      "Mock_uncertain"
    ],
    "filterTypes": [
      "Mock_database",
      "Mock_standards",
      "Mock_policies"
    ],
    "tooltip": "Mock_An indication of whether the resource is currently maintained/supported."
  },]
}
multiTagsStore.getters = {
  getCurrentRegistry: () => { return "database" },
  getQueryParams:  () => {
    return {
      subjects: ['genetics'],
      registry: ['standard'],
      recordType:["test1", "test2"],
      fairsharingRegistry: []
    }
  },
}
multiTagsStore.actions = {
  fetchMultiTagData: vi.fn(),
}

multiTagsStore.commit = vi.fn()

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
})

describe("AddOnFilters.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AddOnFilters, {
      global: {
        data() {
          return {
            switchTypeFilters: addOnFilters["switch"],
            selectTypeFilters: addOnFilters["select"],
          }
        },
        plugins: [vuetify, store],
        mocks: {
          $route: mockRoute,
        },
        stubs: ['router-link', 'router-view']
      }
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("AddOnFilters");
    expect(wrapper.vm.currentRouteQuery).toBe(wrapper.vm.$route.query);
  });

  it("can check switchDisplay computed property", () => {
    wrapper.vm.onlySelect = true
    expect(wrapper.vm.switchDisplay).toBe("d-none");
  });

  it("can check selectDisplay computed property", () => {
    wrapper.vm.onlySwitch = true
    expect(wrapper.vm.selectDisplay).toBe("d-none");
  });

  it("can check checkCheckbox method", async() => {
    const checkCheckbox = wrapper.get("[data-testid='checkCheckbox']");
    checkCheckbox.trigger('click');
    await wrapper.vm.checkCheckbox()
    expect(wrapper.vm.loading).toBe(false);
  });

  it("can check conditionalDisplay method is called", () => {
    //When switchTypeFilters is empty
    wrapper.vm.switchTypeFilters = []
    wrapper.vm.selectTypeFilters = addOnFilters["select"]
    wrapper.vm.conditionalDisplay()
    expect(wrapper.vm.onlySelect).toBe(true);

    //When selectTypeFilters is empty
    wrapper.vm.switchTypeFilters = addOnFilters["switch"]
    wrapper.vm.selectTypeFilters = []
    wrapper.vm.conditionalDisplay()
    expect(wrapper.vm.onlySwitch).toBe(true);
  });

  it("can check conditionalFilters method", () => {
    wrapper.vm.switchTypeFilters = addOnFilters["switch"]
    wrapper.vm.selectTypeFilters = addOnFilters["select"]
    wrapper.vm.conditionalFilters("Mock_database")
    expect(wrapper.vm.switchTypeFilters).toStrictEqual(addOnFilters["switch"]);
    expect(wrapper.vm.selectTypeFilters).toStrictEqual(addOnFilters["select"]);
  });

  it("can check selectFilters method when topResult has value 'database'", () => {
    multiTagsStore.getters = {
      getCurrentRegistry: () => { return "database" },
      getQueryParams:  () => {
        return {
          subjects: ['genetics'],
          registry: ['standard'],
          recordType:["test1", "test2"],
        }
      },
    }
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    })
    wrapper = shallowMount(AddOnFilters, {
      global: {
        data() {
          return {
            switchTypeFilters: addOnFilters["switch"],
            selectTypeFilters: addOnFilters["select"],
          }
        },
        plugins: [vuetify, store],
        mocks: {
          $route: mockRoute,
        },
        stubs: ['router-link', 'router-view']
      }
    })
    wrapper.vm.topResult = 'database'
    expect(wrapper.vm.conditionalFilters("database")).toHaveBeenCalled
  });

  it("can check selectFilters method when topResult has value 'standard'", () => {
    wrapper.vm.topResult = 'standard'
    expect(wrapper.vm.conditionalFilters("standards")).toHaveBeenCalled
  });

  it("can check selectFilters method when topResult has value 'policy'", () => {
    wrapper.vm.topResult = 'policy'
    expect(wrapper.vm.conditionalFilters("policies")).toHaveBeenCalled
  });

});
