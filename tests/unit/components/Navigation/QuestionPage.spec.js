import {createLocalVue, shallowMount} from "@vue/test-utils";
import QuestionPage from "@/components/Navigation/QuestionPage.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";
import multiTagsStore from "@/store/multiTagsStore";
import navigationStore from "@/store/navigationStore";

const localVue = createLocalVue();
localVue.use(Vuex);
let $route = { path: "/0", name: "HomeView", params: {id: 0} };

const vuetify = new Vuetify({'icons':icons});

let actions = {
  resetMultiTags: jest.fn()
}

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
  getCurrentRegistry: () => { return "database" },
  getQueryParams: () => { return {} }
}

navigationStore.mutations = {
  setNavigationState: jest.fn(),
  clearPreviousNavigation: jest.fn(),
  sliceBreadcrumb: jest.fn(),
  setPolicyComplianceState: jest.fn(),
  setComplianceState: jest.fn()

}

navigationStore.getters = {
  getBreadcrumbs: () => {
    return [
      {
        link: '/1',
        text: 'a link'
      }
    ]
  },
  getCompliantWith: () => { return "GenbankSequenceFormat" },
  getCompliantWithPolicy: () => { return "Nature Genetics" },
  getPreviousLocation: () => { return "/99" },
  getRouteQuery: () => { return { "this": "that" }}
}

let store = new Vuex.Store({
  modules: {
    actions,
    multiTagsStore: multiTagsStore,
    navigationStore: navigationStore
  },
})


describe("QuestionPage.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(QuestionPage, {
      localVue,
      vuetify,
      store,
      mocks: {$route},
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("QuestionPage");
  });

});
