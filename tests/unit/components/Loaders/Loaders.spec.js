import {createLocalVue, shallowMount} from "@vue/test-utils";
import Loaders from "@/components/Loaders/Loaders"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("Loaders.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Loaders, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Loaders");
  });

});
