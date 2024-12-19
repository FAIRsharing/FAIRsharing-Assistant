import { shallowMount } from "@vue/test-utils";
import Error from "@/views/Errors/500.vue";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";

const vuetify = createVuetify();

describe("500 error page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Error, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toBe("Error500");
  });
});
