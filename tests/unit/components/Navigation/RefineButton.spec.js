import {createLocalVue, shallowMount} from "@vue/test-utils";
import RefineButton from "@/components/Navigation/RefineButton"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("RefineButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineButton, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineButton");
  });

});
