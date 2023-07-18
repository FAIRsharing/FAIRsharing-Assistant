import {createLocalVue, shallowMount} from "@vue/test-utils";
import ResultView from "@/views/Results/ResultView.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import multiTagsStore from "@/store/multiTagsStore";

const $router = { push: jest.fn() };
let $route = {
  path: "/accounts/profile",
  query: "fairsharingRegistry=Database&recordType=knowledgebase,repository"
};

const localVue = createLocalVue();
localVue.use(Vuex);

let store;

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

store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

const vuetify = new Vuetify();

describe("ResultView.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ResultView, {
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ResultView");
  });

});