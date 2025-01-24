import { shallowMount } from "@vue/test-utils";
import Licence from "@/views/Licence/Licence";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";

const vuetify = createVuetify();

describe("Licence.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Licence, {
      global: {
        plugins: [vuetify],
        stubs: ["router-link"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Licence");
  });
});
