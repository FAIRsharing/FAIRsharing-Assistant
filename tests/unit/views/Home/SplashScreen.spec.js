import {createLocalVue, shallowMount} from "@vue/test-utils";
import SplashScreen from "@/views/Home/SplashScreen.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("SplashScreen.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SplashScreen, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SplashScreen");
  });

});