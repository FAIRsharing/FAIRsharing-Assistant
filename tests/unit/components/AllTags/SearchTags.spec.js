import { shallowMount} from "@vue/test-utils";
import { createStore } from 'vuex';
import { createVuetify } from 'vuetify'
import { describe, expect, it, beforeEach, afterAll, vi } from 'vitest'
import SearchTags from "@/components/AllTags/SearchTags.vue"
import icons from "@/plugins/icons";
import GraphClient from "@/lib/GraphClient/GraphClient"
import sinon from "sinon";
import multiTagsStore from "@/store/multiTagsStore";
// import multiTagFilterQuery from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";
import tagsQuery from "@/lib/GraphClient/queries/geTags.json";

let $route = {
  path: "/",
  params: {
    id: 0
  }
};


multiTagsStore.getters = {
  getFairSharingRecords: () => {
    return [
      {
        record: "Wibble",
        registry: "Standard",
        id: 123,
      }
    ]  
  },
  getQueryParams:  () => {
    return {
      subjects: ['genetics'],
      registry: ['standard']         
    }
  },
  getSelectedTags: () => { return ["asd"] }
}

multiTagsStore.actions = {
  fetchMultiTagData: vi.fn(),
  resetMultiTags: vi.fn(),
};

let store = createStore({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

const vuetify = createVuetify({'icons':icons});

describe("SearchTags.vue", function(){
  let wrapper;
  let graphStub;

  graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
  graphStub.withArgs(tagsQuery).returns({
    searchTags: [
      { id: 1, label: 'label', model: 'subject' }
    ]
  })

  afterAll(() => {
    graphStub.restore();
  })

  beforeEach(() => {
    wrapper = shallowMount(SearchTags, {
      global:{
        plugins: [vuetify, store],
        mocks: {
          $route:  $route
        },
        stubs: ['router-link', 'router-view']
      },
    })
  });

  it("can be instantiated", () => {
    // wrapper.vm.$options.watch.getSelectedTags.handler.call(wrapper.vm);
    expect(wrapper.vm.$options.name).toMatch("SearchTags");
  });

  it("can check recordTags watch when justMounted is true", async () => {
    wrapper.vm.justMounted = true;
    await wrapper.vm.$nextTick()
    wrapper.vm.$options.watch.recordTags.call(wrapper.vm)
    expect(wrapper.vm.recordTags).toStrictEqual(['asd']);
  });

  it("can check searchString watch when value length is less then 3", async () => {
    wrapper.vm.searchString = "ab";
    expect(wrapper.vm.searchString).toBe("ab");
  });

});