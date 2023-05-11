import {createLocalVue, shallowMount} from "@vue/test-utils";
import ContinueButton from "@/components/Navigation/ContinueButton"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("ContinueButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ContinueButton, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ContinueButton");
  });

});
