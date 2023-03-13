import {createLocalVue, shallowMount} from "@vue/test-utils";
import StartOver from "@/components/Navigation/StartOver"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("StartOver.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(StartOver, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("StartOver");
  });

});
