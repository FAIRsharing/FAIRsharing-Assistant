import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import GoHome from "@/components/Navigation/HomeButton.vue";
import multiTagsStore from "@/store/multiTagsStore";
import navigationStore from "@/store/navigationStore";

const vuetify = createVuetify();

const mockRouter = { push: vi.fn() };

const mockRoute = {
  path: "/0",
};

multiTagsStore.actions = {
  resetMultiTags: vi.fn(),
};

navigationStore.mutations = {
  clearNavigation: vi.fn(),
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
    navigationStore: navigationStore,
  },
});

describe("HomeButton.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GoHome, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("GoHome");
  });

  it("check goHome method is called", () => {
    const goHome = wrapper.get("#goHome");
    goHome.trigger("click");
    wrapper.vm.goHome();
    expect(wrapper.vm.$route.path).toBe("/0");
  });
});
