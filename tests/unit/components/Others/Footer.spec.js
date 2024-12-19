import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";
import Footer from "@/components/Others/Footer.vue";

const vuetify = createVuetify();

describe("Footer.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Footer, {
      global: {
        plugins: [vuetify],
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Footer");
  });
});
