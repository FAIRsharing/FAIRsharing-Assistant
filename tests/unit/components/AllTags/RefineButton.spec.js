import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import RefineButton from "@/components/AllTags/RefineButton.vue";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();
const mockRouter = { push: vi.fn() };
let mockRoute = {
  path: "/",
};

const state = {
  queryParams: {
    subjects: ["genetics"],
    dataContactInformation: ["yes"],
  },
};

multiTagsStore.getters = {
  getQueryParams: () => {
    return state.queryParams;
  },
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

describe("RefineButton.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineButton, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
        stubs: ["router-link"],
        props: {
          link: "/",
          choice: "Database",
          count: 0,
        },
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineButton");
  });

  it("check makeChoice method is called", () => {
    const makeChoice = wrapper.get("[data-testid='makeChoice']");
    makeChoice.trigger("click");
    expect(wrapper.vm.makeChoice()).toHaveBeenCalled;
  });
});
