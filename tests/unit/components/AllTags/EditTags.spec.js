import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";
import EditTags from "@/components/AllTags/EditTags.vue";

const vuetify = createVuetify();

describe("EditTags.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(EditTags, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("EditTags");
  });
});
