import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach } from "vitest";
import SelectedTags from "@/components/Others/SelectedTags.vue";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();
const state = {
  queryParams: {
    subjects: ["genetics"],
    dataContactInformation: ["yes"],
    recordType: ["knowledgebase", "repository", "knowledgebase_and_repository"],
  },
  selectedTags: [
    {
      _custom: {
        type: "reactive",
        stateTypeName: "Reactive",
        value: {
          label: "biological regulation",
          id: 1489,
          definitions: [
            "Any process that modulates a measurable attribute of any biological process, quality or function.",
          ],
          iri: "http://purl.obolibrary.org/obo/GO_0065007",
          synonyms: [],
          model: "domain",
          parents: [
            {
              label: "Biological process",
              id: 1399,
              definitions: [
                "A biological process represents a specific objective that the organism is genetically programmed to achieve. Biological processes are often described by their outcome or ending state, e.g., the biological process of cell division results in the creation of two daughter cells (a divided cell) from a single parent cell. A biological process is accomplished by a particular set of molecular functions carried out by specific gene products (or macromolecular complexes), often in a highly regulated manner and in a particular temporal sequence.",
              ],
              iri: "http://purl.obolibrary.org/obo/GO_0008150",
              synonyms: ["biological_process", "physiological process"],
            },
          ],
        },
      },
    },
  ],
};

multiTagsStore.getters = {
  getQueryParams: () => {
    return state.queryParams;
  },
  getSelectedTags: () => {
    return state.selectedTags;
  },
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

describe("SelectedTags.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SelectedTags, {
      global: {
        plugins: [vuetify, store],
        stubs: ["router-link"],
        props: {
          researchPage: false,
          refinePage: false,
        },
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SelectedTags");
  });

  it("deleteTag method is called", () => {
    wrapper.vm.deleteTag(1489, "biological regulation", "domains");
    expect(wrapper.emitted()).toHaveProperty("deleteTag");
  });
});
