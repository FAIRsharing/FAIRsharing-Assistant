import {createLocalVue, shallowMount} from "@vue/test-utils";
import BackButton from "@/components/Navigation/BackButton"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("BackButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(BackButton, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("BackButton");
  });

});
