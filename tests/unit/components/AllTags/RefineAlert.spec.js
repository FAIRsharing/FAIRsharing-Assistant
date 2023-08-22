import {createLocalVue, shallowMount} from "@vue/test-utils";
import RefineAlert from "@/components/AllTags/RefineAlert"
import Vuetify from "vuetify"
import Vuex from "vuex";
import multiTagsStore from "@/store/multiTagsStore";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

multiTagsStore.getters = {
  getRefinedStatus: () => { return true },
  getCurrentRegistry: () => { return 'standard' },
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  },
})

describe("RefineAlert.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RefineAlert, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RefineAlert");
  });

});
