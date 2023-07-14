import {createLocalVue, shallowMount} from "@vue/test-utils";
import EditTags from "@/components/AllTags/EditTags.vue"
import Vuetify from "vuetify"
import Vuex from "vuex";
import icons from "@/plugins/icons";
//import multiTagsStore from "@/store/multiTagsStore";

const localVue = createLocalVue();
localVue.use(Vuex);


let getters, store;

// TODO: This appears to not provide the required stores in the components.

getters = {
  multiTagsStore: () => {
    return {
      getFairSharingRecords: [
        {
          record: "Wibble",
          registry: "Standard",
          id: 123,
        }
      ],
      getQueryParams:  {
        subjects: ['genetics'],
        registry: ['standard']
      },
      getRefinedStatus: true,
      getCurrentRegistry: 'standard',
      getSelectedTags: []
    }
  }
}

store = new Vuex.Store({
  getters
})

const vuetify = new Vuetify({'icons':icons});

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