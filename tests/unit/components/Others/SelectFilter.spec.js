import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import SelectFilter from "@/components/Others/SelectFilter.vue";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();
const state = {
  queryParams: {
    subjects: ["genetics"],
    dataContactInformation: ["yes"],
    recordType: ["knowledgebase", "repository", "knowledgebase_and_repository"],
  },
};

multiTagsStore.getters = {
  getQueryParams: () => {
    return state.queryParams;
  },
};

multiTagsStore.actions = {
  fetchMultiTagData: vi.fn(),
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

describe("SelectFilter.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SelectFilter, {
      global: {
        plugins: [vuetify, store],
        stubs: ["router-link"],
        props: {
          filter: {},
        },
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SelectFilter");
  });

  it("cleanText method is called", () => {
    wrapper.vm.cleanText("_abc");
    expect(wrapper.vm.cleanText("_abc")).toBe(" abc");

    wrapper.vm.cleanText(123);
    expect(wrapper.vm.cleanText(123)).toBe(123);
  });

  it("selectToggle method is called", async () => {
    const filter = {
      filterName: "Data Contact Information",
      filterQuery: "dataContactInformation",
      refineToggle: ["yes"],
      options: ["yes", "no", "not found"],
      filterTypes: ["database"],
      tooltip:
        "Does the repository show data depositor contact information on dataset landing pages?",
    };

    await wrapper.setProps({ filter: filter });
    //When no select filter value is selected
    wrapper.vm.selectToggle(wrapper.props().filter);

    //When select filter value is selected
    wrapper.vm.filtersOpted = ["yes"];
    wrapper.vm.filterSelected.key = "dataContactInformation";
    wrapper.vm.filterSelected.value = ["yes"];
    wrapper.vm.selectToggle(wrapper.props().filter);

    expect(wrapper.vm.getQueryParams).toStrictEqual(state.queryParams);
  });

  it("preSelectedFilter method is called", async () => {
    const filter = {
      filterName: "Data Contact Information",
      filterQuery: "dataContactInformation",
      refineToggle: ["yes"],
      options: ["yes", "no", "not found"],
      filterTypes: ["database"],
      tooltip:
        "Does the repository show data depositor contact information on dataset landing pages?",
    };

    await wrapper.setProps({ filter: filter });
    expect(wrapper.vm.preSelectedFilter()).toHaveBeenCalled;
  });
});
