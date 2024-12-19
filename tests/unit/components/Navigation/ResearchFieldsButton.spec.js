import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import ResearchFieldsButton from "@/components/Navigation/ResearchFieldsButton.vue";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();
const mockRouter = { push: vi.fn() };
let mockRoute = {
  path: "/researchfields",
};

multiTagsStore.getters = {
  getFairSharingRecords: () => {
    return [
      {
        id: 1009,
        name: "Language",
        registry: "Standard",
        status: "ready",
        type: "model_and_format",
      },
    ];
  },
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

describe("ResearchFieldsButton.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ResearchFieldsButton, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
        stubs: ["router-link"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ResearchFieldsButton");
  });

  it("can check tagButtonActive computed property", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [];
      },
    };

    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    });
    wrapper = shallowMount(ResearchFieldsButton, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
        stubs: ["router-link"],
      },
    });
    wrapper.vm.tagButtonActive;
    expect(wrapper.vm.tagButtonActive).toBe(false);
  });

  it("can check returnToTags method", () => {
    const returnToTags = wrapper.get("[data-testid='returnToTags']");
    returnToTags.trigger("click");
    wrapper.vm.returnToTags();
    expect(wrapper.vm.$route.path).toBe("/researchfields");
  });
});
