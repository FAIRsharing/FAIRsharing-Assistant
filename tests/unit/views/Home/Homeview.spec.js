import {createLocalVue, shallowMount} from "@vue/test-utils";
import HomeView from "@/views/Home/HomeView.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("HomeView.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(HomeView, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("HomeView");
  });

});