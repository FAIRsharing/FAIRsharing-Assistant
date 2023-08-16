import {createLocalVue, shallowMount} from "@vue/test-utils";
import SearchTags from "@/components/AllTags/SearchTags.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";
import GraphClient from "@/lib/GraphClient/GraphClient"
import sinon from "sinon";
import multiTagsStore from "@/store/multiTagsStore";
import multiTagsFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";

const localVue = createLocalVue();
localVue.use(Vuex);
let store;

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
  getSelectedTags: () => { return [] }
}

store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

const vuetify = new Vuetify({'icons':icons});

describe("SearchTags.vue", function(){
  let wrapper;
  let graphStub;

  graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
  graphStub.withArgs(multiTagsFilter).returns({
    searchTags: [
      { id: 1, label: 'label', model: 'subject' }
    ]
  })

  afterAll(() => {
    graphStub.restore();
  })

  beforeEach(() => {
    wrapper = shallowMount(SearchTags, {
      localVue,
      vuetify,
      store
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SearchTags");
  });
});