import {createLocalVue, shallowMount} from "@vue/test-utils";
import TagsCard from "@/components/AllTags/TagsCard"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";
import multiTagsStore from "@/store/multiTagsStore";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify({'icons':icons});

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
  getCurrentRegistry: () => {
    return "Database"
  }
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("TagsCard.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TagsCard, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("TagsCard");
  });

});
