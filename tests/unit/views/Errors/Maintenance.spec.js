import { shallowMount } from "@vue/test-utils";
import Maintenance from "@/views/Errors/Maintenance.vue";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";

const vuetify = createVuetify();

describe("Maintenance page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Maintenance, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toBe("Maintenance");
  });
});
