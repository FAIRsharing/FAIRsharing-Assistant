import {createLocalVue, shallowMount} from "@vue/test-utils";
import ResearchFieldsButton from "@/components/Navigation/ResearchFieldsButton.vue"
import Vuetify from "vuetify"
import multiTagsStore from "@/store/multiTagsStore";
import Vuex from "vuex";

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
}

let store = new Vuex.Store({
  modules: {
    multiTagsStore: multiTagsStore,
  },
})

describe("ResearchFieldsButton.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ResearchFieldsButton, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link']
    })
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ResearchFieldsButton");
  });

});