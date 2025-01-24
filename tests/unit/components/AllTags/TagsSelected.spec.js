import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import {describe, expect, it, beforeEach, vi} from "vitest";
import TagsSelected from "@/components/AllTags/TagsSelected";
import multiTagsStore from "@/store/multiTagsStore";

const vuetify = createVuetify();

const state = {
  selectedTags: [1, 2, 3],
};

multiTagsStore.getters = {
  getSelectedTags: () => {
    return state.selectedTags;
  },
  getQueryParams: () => {
    return {
      subjects: ["genetics", "label"],
      registry: ["standard"],
    };
  },
};
multiTagsStore.commit = vi.fn();

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});
describe("TagsSelected.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TagsSelected, {
      global: {
        data() {
          return {
            selectedTags: [],
            selectedQueryParam: [],
            showSelected: false,
            buttonMessage: "Show selected tags",
            help: false,
          };
        },
        plugins: [vuetify, store],
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", () => {
    wrapper.vm.$options.watch.getSelectedTags.handler.call(wrapper.vm);
    expect(wrapper.vm.$options.name).toMatch("TagsSelected");
  });

  it("can check queryParamTags method", () => {
    let queryParamTags = wrapper.vm.queryParamTags("taxonomic range");
    expect(queryParamTags).toBe("taxonomies");

    queryParamTags = wrapper.vm.queryParamTags("user_defined_tag");
    expect(queryParamTags).toBe("userDefinedTags");

    queryParamTags = wrapper.vm.queryParamTags("abcd");
    expect(queryParamTags).toBe("abcd");
  });

  it("can check toggleSelected method", () => {
    const toggleSelected = wrapper.get("[data-testid='toggleSelected']");
    toggleSelected.trigger("click");
    wrapper.vm.toggleSelected();
    expect(wrapper.vm.buttonMessage).toBe("Show selected tags");

    wrapper.vm.showSelected = true;
    toggleSelected.trigger("click");
    wrapper.vm.toggleSelected();
    expect(wrapper.vm.buttonMessage).toBe("Hide selected tags");
  });

  it("can check showHelp method", () => {
    const showHelp = wrapper.get("[data-testid='showHelp']");
    showHelp.trigger("click");
    wrapper.vm.showHelp();
    expect(wrapper.vm.help).toBe(true);
  });

  it("can check hideHelp method", () => {
    wrapper.vm.hideHelp();
    expect(wrapper.vm.help).toBe(false);
  });

  it("can check removeTag method", () => {
    const tagParams = [1, 'label', 'subjects']
    wrapper.vm.removeTag(tagParams);
    wrapper.vm.queryParamTags("subjects");
    expect(wrapper.vm.selectedQueryParam).toStrictEqual(["genetics"]);
  });
});
