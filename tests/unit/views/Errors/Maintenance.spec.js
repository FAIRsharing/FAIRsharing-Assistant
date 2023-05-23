import { createLocalVue, shallowMount } from "@vue/test-utils";
import Maintenance from "@/views/Errors/Maintenance.vue";
import Vuex from "vuex";
import Vuetify from "vuetify";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

describe("Maintenance page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Maintenance, {
      localVue,
      vuetify
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toBe("Maintenance");

  });

});
