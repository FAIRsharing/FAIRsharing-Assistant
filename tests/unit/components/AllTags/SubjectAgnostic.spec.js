import {createLocalVue, shallowMount} from "@vue/test-utils";
import SubjectAgnostic from "@/components/AllTags/SubjectAgnostic"
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
  getCurrentRegistry: () => {
    return "standard"
  }
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  },
})

describe("SubjectAgnostic.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SubjectAgnostic, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SubjectAgnostic");
  });

});
