import {createLocalVue, shallowMount} from "@vue/test-utils";
import TagsSelected from "@/components/AllTags/TagsSelected"
import Vuetify from "vuetify"
import Vuex from "vuex";
import multiTagsStore from "@/store/multiTagsStore";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

multiTagsStore.getters = {
  getSelectedTags: () => { return [] },
  getQueryParams:  () => {
    return {
      subjects: ['genetics'],
      registry: ['standard']
    }
  },
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})
describe("TagsSelected.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TagsSelected, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("TagsSelected");
  });

});
