import {createLocalVue, shallowMount} from "@vue/test-utils";
import Header from "@/components/Navigation/Header"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();
let $route = { path: "/", name: "HomeView"};


describe("Header.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Header, {
      localVue,
      vuetify,
      mocks: { $route},
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Header");
  });

});
