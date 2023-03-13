import {createLocalVue, shallowMount} from "@vue/test-utils";
import ApplyFilterButton from "@/components/Navigation/ApplyFilterButton"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("ApplyFilterButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ApplyFilterButton, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ApplyFilterButton");
  });

});
