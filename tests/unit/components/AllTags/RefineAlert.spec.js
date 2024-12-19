import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";
import RefineAlert from "@/components/AllTags/RefineAlert";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();

multiTagsStore.getters = {
  getRefinedStatus: () => {
    return false;
  },
  getCurrentRegistry: () => {
    return "standard";
  },
  getSelectionMessage: () => {
    return "Test string";
  },
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

describe("RefineAlert.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineAlert, {
      global: {
        plugins: [vuetify, store],
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.getRefinedStatus).toBe(false);
    expect(wrapper.vm.$options.name).toMatch("RefineAlert");
  });
});
