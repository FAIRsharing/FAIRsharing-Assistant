import {createLocalVue, shallowMount} from "@vue/test-utils";
import ClearAllSelections from "@/components/Navigation/ClearAllSelections.vue"
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
        id:1009,
        name:"Language",
        registry:"Standard",
        status:"ready",
        type:"model_and_format"
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
}

let actions = {
  resetMultiTags: jest.fn()
}


let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
    actions
  },

})

describe("ClearAllSelections.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ClearAllSelections, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ClearAllSelections");
  });

});
