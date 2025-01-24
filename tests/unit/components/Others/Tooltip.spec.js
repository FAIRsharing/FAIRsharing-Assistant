import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";
import Tooltip from "@/components/Others/Tooltip.vue";

const vuetify = createVuetify();

describe("Tooltip.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Tooltip, {
      global: {
        plugins: [vuetify],
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Tooltip");
  });
});
