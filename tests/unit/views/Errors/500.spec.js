import { createLocalVue, shallowMount } from "@vue/test-utils";
import Error from "@/views/Errors/500.vue";
import Vuex from "vuex";
import Vuetify from "vuetify";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

describe("500 error page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Error, {
      localVue,
      vuetify
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toBe("Error500");
  });

});
