import {createLocalVue, shallowMount} from "@vue/test-utils";
import ViewRecords from "@/components/AllTags/ViewRecords"
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
  }
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  }
})

describe("ViewRecords.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ViewRecords, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link', 'router-view']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ViewRecords");
  });

});
