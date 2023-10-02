import {createLocalVue, shallowMount} from "@vue/test-utils";
import QuestionPage from "@/components/Navigation/QuestionPage.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";
const localVue = createLocalVue();
localVue.use(Vuex);
let $route = { path: "/", name: "HomeView"};

const vuetify = new Vuetify({'icons':icons});


describe("QuestionPage.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(QuestionPage, {
      localVue,
      vuetify,
      mocks: {$route},
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("QuestionPage");
  });

});
