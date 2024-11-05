import { shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import ResultView from "@/views/Results/ResultView.vue"
import multiTagsStore from "@/store/multiTagsStore";
import navigationStore from "@/store/navigationStore";


const vuetify = createVuetify();

const mockRouter = { push: vi.fn() };
let mockRoute = {
  path: "/accounts/profile",
  query: "fairsharingRegistry=Database&recordType=knowledgebase,repository",
  params: {
    id: "/accounts/profile"
  }
};

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
      subjects: ['genetics'],
      registry: ['standard']
    }
  },
  getRefinedStatus: () => { return true },
  getCurrentRegistry: () => { return 'standard' },
  getSelectedTags: () => { return [] }
}

navigationStore.getters = {
  getBreadcrumbs() {
    return []
  }
}

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
    navigationStore: navigationStore
  }
})


describe("ResultView.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ResultView, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        },
        stubs: ['router-link', 'router-view']
      },

    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ResultView");
  });

  it("noRecords method is called", () => {
    wrapper.vm.noRecords(true);
    expect(wrapper.vm.$route.path).toBe('/accounts/profile');
  });

});