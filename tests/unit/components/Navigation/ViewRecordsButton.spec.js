import {shallowMount} from "@vue/test-utils";
import ViewRecordsButton from "@/components/Navigation/ViewRecordsButton.vue"
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import {describe, expect, it, beforeEach, vi} from 'vitest'
import multiTagsStore from "@/store/multiTagsStore";
import ResearchFieldsButton from "@/components/Navigation/ResearchFieldsButton.vue";

const vuetify = createVuetify();

const mockRouter = { push: vi.fn() };
let mockRoute = {
  path: "/results",
};

multiTagsStore.getters = {
  getFairSharingRecords: () => {
    return [
      {
        id:1009,
        name:"Language",
        registry:"Standard",
        status:"ready",
        type:"model_and_format"
      }
    ]
  }
}

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("ViewRecordsButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ViewRecordsButton, {
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
    expect(wrapper.vm.$options.name).toMatch("ViewRecordsButton");
  })

  it("can check resultsButtonActive computed property", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return []
      },
    }

    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    })
    wrapper = shallowMount(ViewRecordsButton, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        },
        stubs: ['router-link']
      },
    })
    wrapper.vm.resultsButtonActive
    expect(wrapper.vm.resultsButtonActive).toBe(false);
  });

  it("can check showResults method", () => {
    const showResults = wrapper.get("[data-testid='showResults']");
    showResults.trigger('click')
    wrapper.vm.showResults()
    expect(wrapper.vm.$route.path).toBe('/results');
  });

});
