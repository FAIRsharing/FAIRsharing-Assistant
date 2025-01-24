import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import { describe, expect, it, beforeEach, afterAll, vi } from "vitest";
import SearchTags from "@/components/AllTags/SearchTags.vue";
import icons from "@/plugins/icons";
import GraphClient from "@/lib/GraphClient/GraphClient";
import sinon from "sinon";
import multiTagsStore from "@/store/multiTagsStore";

let $route = {
  path: "/",
  params: {
    id: 0,
  },
};

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
  getSelectedTags: () => {
    return ["asd"];
  },
};

multiTagsStore.actions = {
  fetchMultiTagData: vi.fn(),
  resetMultiTags: vi.fn(),
};

multiTagsStore.commit = vi.fn();

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  },
});

const vuetify = createVuetify({ icons: icons });

describe("SearchTags.vue", function () {
  let wrapper;
  let graphStub;

  graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
  graphStub.returns({
    searchTags: [{ id: 1, label: "label", model: "subject" }],
  });

  afterAll(() => {
    graphStub.restore();
  });

  beforeEach(() => {
    wrapper = shallowMount(SearchTags, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $route: $route,
        },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("can be instantiated", async () => {
    await wrapper.vm.$options.watch.getSelectedTags.handler.call(wrapper.vm, [
      "newValue",
    ]);
    await wrapper.vm.$options.watch.searchString.call(wrapper.vm, "abcd");
    expect(wrapper.vm.$options.name).toMatch("SearchTags");
  });

  it("can check recordTags watch when justMounted is true", async () => {
    wrapper.vm.justMounted = true;
    await wrapper.vm.$nextTick();
    wrapper.vm.$options.watch.recordTags.call(wrapper.vm);
    expect(wrapper.vm.recordTags).toStrictEqual(["asd"]);
  });

  it("can check recordTags watch when justMounted is false (Line 167 of code)", async () => {
    let val = [
      {
        model: "domain",
        label: "abc",
        id: 1,
      },
    ];
    wrapper.vm.justMounted = false;
    await wrapper.vm.$nextTick();
    wrapper.vm.$options.watch.recordTags.call(wrapper.vm, val);
    let run = wrapper.vm.generateQuery(val)[1];
    expect(run).toBe(true);
  });

  it("can check searchString watch when value length is less then 3", async () => {
    wrapper.vm.searchString = "ab";
    expect(wrapper.vm.searchString).toBe("ab");
  });

  it("can check getTags method", async () => {
    graphStub.returns({
      error: false,
    });
    let getTagsMethod = await wrapper.vm.getTags("abcd");
    expect(getTagsMethod).toHaveBeenCalled;
  });

  it("can check generateQuery method", () => {
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

  it("can check selectSubjectAgnostic method", () => {
    let tags = [
      {
        id: 1,
        label: "subject agnostic",
      },
    ];
    wrapper.vm.tags = tags;
    wrapper.vm.recordTags = [];
    wrapper.vm.selectSubjectAgnostic();
    expect(wrapper.vm.recordTags).toStrictEqual(tags);
  });
});
