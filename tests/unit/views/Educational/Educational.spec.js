import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import Educational from "@/views/Educational/Educational.vue";
import navigationStore from "@/store/navigationStore";

const vuetify = createVuetify();

const $router = { push: vi.fn() };
let $route = {
  path: "/educational/claim",
  params: {
    text: "claim",
  },
};

navigationStore.getters = {
  getBreadcrumbs() {
    return [];
  },
};

let store = createStore({
  modules: {
    navigationStore: navigationStore,
  },
});

describe("Educational.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Educational, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: $router,
          $route: $route,
        },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Educational");
  });

  it("no params text", () => {
    $route = {
      params: {},
    };
    wrapper = shallowMount(Educational, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: $router,
          $route: $route,
        },
        stubs: ["router-link", "router-view"],
      },
    });
    expect(wrapper.vm.text).toMatchObject(["<p>Nothing to see here!</p>"]);
  });
});
