import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";
import AllTags from "@/views/AllTags/AllTags.vue";

const vuetify = createVuetify();

describe("AllTags.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AllTags, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("AllTags");
  });
});
