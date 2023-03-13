import {createLocalVue, shallowMount} from "@vue/test-utils";
import DomainButton from "@/components/Navigation/DomainButton"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("DomainButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DomainButton, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("DomainButton");
  });

});
