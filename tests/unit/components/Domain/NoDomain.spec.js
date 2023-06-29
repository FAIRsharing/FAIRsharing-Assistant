import {createLocalVue, shallowMount} from "@vue/test-utils";
import NoDomain from "@/components/Domain/NoDomain.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();


describe("NoDomain.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(NoDomain, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("NoDomain");
  });

});