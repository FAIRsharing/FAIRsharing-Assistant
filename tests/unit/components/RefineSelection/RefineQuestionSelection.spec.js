import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import RefineQuestionSelection from "@/components/RefineSelection/RefineQuestionSelection.vue";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();
const mockRouter = { push: vi.fn() };
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
      fairsharingRegistry: ["fairsharingRegistry"],
      domains: ["domains"],
      subjects: ["subjects"],
      taxonomies: ["taxonomies"],
      userDefinedTags: ["userDefinedTags"],
    };
  },
  getCurrentRegistry: () => {
    return "database";
  },
  getSelectedTags: () => {
    return ["asd"];
  },
};
multiTagsStore.commit = vi.fn();
multiTagsStore.actions = {
  fetchMultiTagData: vi.fn(),
  resetMultiTags: vi.fn(),
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

describe("RefineQuestionSelection.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineQuestionSelection, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
        },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", async () => {
    expect(wrapper.vm.$options.name).toMatch("RefineQuestionSelection");
  });

  // it("can searchString watch when it has value of length lesser than 3", async () => {
  //   wrapper.vm.searchString = "xy";
  //   expect(wrapper.vm.searchString).toBe("xy");
  // });
  //
  // it("can searchString watch when it has value of length greater than 3", async () => {
  //   wrapper.vm.searchString = "abcd";
  //   await wrapper.vm.$nextTick();
  //   await expect(wrapper.vm.getResults("abcd")).toHaveBeenCalled;
  // });
  //
  it("can recordTags watch is executed", async () => {
    wrapper.vm.recordTags = ["xyz"];
    wrapper.vm.mounted = true;
    wrapper.vm.loading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.getFairSharingRecords).toHaveBeenCalled;
  });

  it("can clearResults method is executed", () => {
    wrapper.vm.clearResults();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.tags).toStrictEqual([]);
  });

  it("can generateQuery method is executed", () => {
    let val = [
      {
        model: "domain",
        label: "abc",
        id: 1,
      },
      {
        model: "subject",
        label: "xyz",
        id: 2,
      },
      {
        model: "taxonomy",
        label: "pqr",
        id: 3,
      },
      {
        model: "user_defined_tag",
        label: "stu",
        id: 4,
      },
    ];
    wrapper.vm.generateQuery(val);
    let domainsArr = ["abc"];
    expect(wrapper.vm.getQueryParams.domains).toStrictEqual(domainsArr);
  });

  it("can deleteTag method is executed", () => {
    wrapper.vm.recordTags = [
      {
        model: "domain",
        label: "abc",
        id: 1,
      },
      {
        model: "subject",
        label: "xyz",
        id: 2,
      },
      {
        model: "taxonomy",
        label: "pqr",
        id: 3,
      },
      {
        model: "user_defined_tag",
        label: "stu",
        id: 4,
      },
    ];

    let resultTags = [
      {
        model: "subject",
        label: "xyz",
        id: 2,
      },
      {
        model: "taxonomy",
        label: "pqr",
        id: 3,
      },
      {
        model: "user_defined_tag",
        label: "stu",
        id: 4,
      },
    ];
    wrapper.vm.deleteTag(1, "domain");

    expect(wrapper.vm.recordTags).toStrictEqual(resultTags);
  });
});
