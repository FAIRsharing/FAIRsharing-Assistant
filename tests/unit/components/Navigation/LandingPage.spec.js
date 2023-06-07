import {createLocalVue, shallowMount} from "@vue/test-utils";
import LandingPage from "@/components/Navigation/LandingPage"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";
const localVue = createLocalVue();
localVue.use(Vuex);
let $route = { path: "/", name: "HomeView"};

const vuetify = new Vuetify({'icons':icons});


describe("LandingPage.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(LandingPage, {
      localVue,
      vuetify,
      mocks: {$route},
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("LandingPage");
  });

});
