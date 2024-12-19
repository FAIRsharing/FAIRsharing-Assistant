import { shallowMount } from "@vue/test-utils";
import HomeView from "@/views/Home/HomeView.vue";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";

const vuetify = createVuetify();

let $route = {
  path: "/",
  params: {
    id: 0,
  },
};

describe("HomeView.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(HomeView, {
      global: {
        plugins: [vuetify],
        mocks: {
          $route: $route,
        },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("HomeView");
  });
});
