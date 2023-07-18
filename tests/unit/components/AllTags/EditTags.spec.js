import {createLocalVue, shallowMount} from "@vue/test-utils";
import EditTags from "@/components/AllTags/EditTags.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";
import GraphClient from "@/lib/GraphClient/GraphClient"
import sinon from "sinon";
import multiTagsStore from "@/store/multiTagsStore";
import multiTagsFilter from "@/lib/GraphClient/queries/multiTagsFilter/multiTagsFilter.json";

const localVue = createLocalVue();
localVue.use(Vuex);
let getters, store;

// TODO: This appears to not provide the required stores in the components.
// TODO: i.e. `[vuex] module namespace not found in mapGetters(): multiTagsStore/`

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
  getRefinedStatus: () => { return true },
  getCurrentRegistry: () => { return 'standard' },
  getSelectedTags: () => { return [] }
}

store = new Vuex.Store({
  getters
})

const vuetify = new Vuetify({'icons':icons});

describe("EditTags.vue", function(){
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
    wrapper = shallowMount(EditTags, {
      localVue,
      vuetify,
      store
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("EditTags");
  });

  /*
  it("can get tags", async () => {
    expect(wrapper.vm.recordTags).toStrictEqual([]);
    let tags = await wrapper.vm.getTags('label');
    console.log("TAGS: " + JSON.stringify(tags));
    expect(wrapper.vm.tags).toStrictEqual([{id: 1, label: 'label', model: 'subject'}]);
  });
   */



});