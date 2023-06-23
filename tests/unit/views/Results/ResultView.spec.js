import {createLocalVue, shallowMount} from "@vue/test-utils";
import ResultView from "@/views/Results/ResultView.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";

const $router = { push: jest.fn() };
let $route = {
  path: "/accounts/profile",
  query: "fairsharingRegistry=Database&recordType=knowledgebase,repository"
};


const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("ResultView.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ResultView, {
      localVue,
      vuetify,
      mocks: { $router, $route },
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ResultView");
  });

});