import { createLocalVue, shallowMount } from "@vue/test-utils";
import Error from "@/views/Errors/404.vue";
import Vuetify from "vuetify"
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

describe("404 error page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Error, {
      localVue,
      vuetify
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toBe("Error404");
  });

});
