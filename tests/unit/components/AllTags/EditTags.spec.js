import {createLocalVue, shallowMount} from "@vue/test-utils";
import EditTags from "@/components/AllTags/EditTags.vue"
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
  getSelectedTags: () => { return [] }
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})


describe("EditTags.vue", function(){
  let wrapper;

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
});