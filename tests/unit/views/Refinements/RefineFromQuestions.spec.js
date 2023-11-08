import {createLocalVue, shallowMount} from "@vue/test-utils";
import RefineFromQuestions from "@/views/Refinements/RefineFromQuestions.vue";
import multiTagsStore from "@/store/multiTagsStore";
import icons from '@/plugins/icons';
import Vuetify from "vuetify"
import Vuex from "vuex";

const $router = { push: jest.fn() };

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
  getRefinedStatus: () => { return true },
  getCurrentRegistry: () => { return 'standard' },
  getSelectedTags: () => { return [] }
}

store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

const vuetify = new Vuetify({'icons': icons });

describe("RefineSelection.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineFromQuestions, {
      localVue,
      vuetify,
      store,
      mocks: { $router },
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineFromQuestions");
  });

});
