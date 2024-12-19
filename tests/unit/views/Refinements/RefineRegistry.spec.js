import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import RefineRegistry from "@/views/Refinements/RefineRegistry.vue";
import multiTagsStore from "@/store/multiTagsStore";
import icons from "@/plugins/icons";

const mockRouter = { push: vi.fn() };

const vuetify = createVuetify({ icons: icons });

multiTagsStore.getters = {
  getFairSharingRecords: () => {
    return [
      {
        record: "Wibble",
        registry: "Standard",
        id: 123,
      },
    ];
  },
  getQueryParams: () => {
    return {
      subjects: ["genetics"],
      registry: ["standard"],
    };
  },
  getRefinedStatus: () => {
    return true;
  },
  getCurrentRegistry: () => {
    return "standard";
  },
  getSelectedTags: () => {
    return [];
  },
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

describe("RefineSelection.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineRegistry, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
        },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineRegistry");
  });
});
