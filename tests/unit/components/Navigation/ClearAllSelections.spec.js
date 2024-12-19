import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import ClearAllSelections from "@/components/Navigation/ClearAllSelections.vue";
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
};

multiTagsStore.actions = {
  resetMultiTags: vi.fn(),
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

describe("ClearAllSelections.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ClearAllSelections, {
      global: {
        props: {
          refinePage: true,
        },
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
    expect(wrapper.vm.$options.name).toMatch("ClearAllSelections");
  });

  it("can check clearButtonActive computed property when only 'getQueryParams' have values", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [];
      },
      getQueryParams: () => {
        return {
          subjects: ["genetics"],
          registry: ["standard"],
        };
      },
      getRefinedStatus: () => {
        return false;
      },
      getCurrentRegistry: () => {
        return "";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    });

    wrapper = shallowMount(ClearAllSelections, {
      global: {
        props: {
          refinePage: true,
        },
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
        stubs: ["router-link", "router-view"],
      },
    });
    const clearButtonActive = wrapper.vm.clearButtonActive;
    expect(clearButtonActive).toBe(true);
  });

  it("can check clearButtonActive computed property when only 'getRefinedStatus' is true", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [];
      },
      getQueryParams: () => {
        return {};
      },
      getRefinedStatus: () => {
        return true;
      },
      getCurrentRegistry: () => {
        return "";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    });

    wrapper = shallowMount(ClearAllSelections, {
      global: {
        props: {
          refinePage: true,
        },
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
        stubs: ["router-link", "router-view"],
      },
    });
    const clearButtonActive = wrapper.vm.clearButtonActive;
    expect(clearButtonActive).toBe(true);
  });

  it("can check clearButtonActive computed property when only 'getCurrentRegistry' is true", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [];
      },
      getQueryParams: () => {
        return {};
      },
      getRefinedStatus: () => {
        return false;
      },
      getCurrentRegistry: () => {
        return "standard";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    });

    wrapper = shallowMount(ClearAllSelections, {
      global: {
        props: {
          refinePage: true,
        },
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
        stubs: ["router-link", "router-view"],
      },
    });
    const clearButtonActive = wrapper.vm.clearButtonActive;
    expect(clearButtonActive).toBe(true);
  });

  it("can check clearButtonActive computed property for ELSE condition", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [];
      },
      getQueryParams: () => {
        return {};
      },
      getRefinedStatus: () => {
        return false;
      },
      getCurrentRegistry: () => {
        return "";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    });

    wrapper = shallowMount(ClearAllSelections, {
      global: {
        props: {
          refinePage: true,
        },
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
        stubs: ["router-link", "router-view"],
      },
    });
    const clearButtonActive = wrapper.vm.clearButtonActive;
    expect(clearButtonActive).toBe(false);
  });

  it("can check clearResults method", async () => {
    const clearResults = wrapper.get("[data-testid='clearResults']");
    clearResults.trigger("click");
    await wrapper.setProps({ refinePage: true });
    wrapper.vm.clearResults();
    expect(wrapper.vm.resetMultiTags).toHaveBeenCalled;
    expect(wrapper.vm.$route.path).toBe("/researchfields");
  });
});
