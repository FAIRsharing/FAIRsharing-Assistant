import {createLocalVue, shallowMount} from "@vue/test-utils";
import QuestionPage from "@/components/Navigation/QuestionPage.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";
import multiTagsStore from "@/store/multiTagsStore";

const localVue = createLocalVue();
localVue.use(Vuex);
let $route = { path: "/", name: "HomeView"};

const vuetify = new Vuetify({'icons':icons});

let actions = {
  resetMultiTags: jest.fn(),
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

let store = new Vuex.Store({
  modules: {
    actions,
    multiTagsStore: multiTagsStore
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
