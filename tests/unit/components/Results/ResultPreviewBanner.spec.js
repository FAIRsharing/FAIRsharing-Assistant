import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";
import ResultPreviewBanner from "@/components/Results/ResultPreviewBanner.vue";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();

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
  getCurrentRegistry: () => {
    return "standard";
  },
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

describe("ResultPreviewBanner.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ResultPreviewBanner, {
      global: {
        plugins: [vuetify, store],
      },
      props: {
        showBanner: false,
      },
    });
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("ResultPreviewBanner");
  });

  it("can resultCountColour method when getFairSharingRecords records are lesser than 10", () => {
    wrapper.vm.resultCountColour();
    expect(wrapper.vm.resultCountColour()).toBe("warning");
  });

  it("can resultCountColour method when getFairSharingRecords records are more than 10", () => {
    multiTagsStore.getters = {
      getFairSharingRecords: () => {
        return [
          {
            record: "Wibble",
            registry: "Standard",
            id: 1,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 2,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 3,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 4,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 5,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 6,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 7,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 8,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 9,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 10,
          },
          {
            record: "Wibble",
            registry: "Standard",
            id: 11,
          },
        ];
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    });
    wrapper = shallowMount(ResultPreviewBanner, {
      global: {
        plugins: [vuetify, store],
      },
      props: {
        showBanner: false,
      },
    });
    wrapper.vm.resultCountColour();
    expect(wrapper.vm.resultCountColour()).toBe("success");
  });

  it("can resultCountColour method when getFairSharingRecords has no records", () => {
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
    wrapper = shallowMount(ResultPreviewBanner, {
      global: {
        plugins: [vuetify, store],
      },
      props: {
        showBanner: false,
      },
    });
    wrapper.vm.resultCountColour();
    expect(wrapper.vm.resultCountColour()).toBe("error");
  });

  it("can getCurrentRegistryBold method when getCurrentRegistry getter return a string", () => {
    multiTagsStore.getters = {
      getCurrentRegistry: () => {
        return "standard";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    });
    wrapper = shallowMount(ResultPreviewBanner, {
      global: {
        plugins: [store],
      },
    });
    wrapper.vm.getCurrentRegistryBold();
    expect(wrapper.vm.getCurrentRegistryBold()).toBe('standard');
  });

  it("can getCurrentRegistryBold method when getCurrentRegistry getter does not return a string", () => {
    multiTagsStore.getters = {
      getCurrentRegistry: () => {
        return "";
      },
    };
    store = createStore({
      modules: {
        multiTagsStore: multiTagsStore,
      },
    });
    wrapper = shallowMount(ResultPreviewBanner, {
      global: {
        plugins: [store],
      },
    });
    wrapper.vm.getCurrentRegistryBold();
    expect(wrapper.vm.getCurrentRegistryBold()).toBe("");
  });
});
