import {createLocalVue, shallowMount} from "@vue/test-utils";
import RefineSelection from "@/components/RefineSelection/RefineSelection.vue";
import Vuetify from "vuetify"
import Vuex from "vuex";
import multiTagsStore from "@/store/multiTagsStore";


const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

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
  getCurrentRegistry: () => { return "database" }
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("RefineSelection.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineSelection, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineSelection");
  });

});
