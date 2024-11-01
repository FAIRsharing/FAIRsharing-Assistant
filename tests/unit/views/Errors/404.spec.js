import {  mount } from "@vue/test-utils";
import Error from "@/views/Errors/404.vue";
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach } from 'vitest'

const vuetify = createVuetify();

describe("404 error page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Error,{
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toBe("Error404");
  });

});
